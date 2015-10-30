'use strict';
const relativeLocation = require('./relativeLocation');
const mkdirp = require('mkdirp');
const ComponentTranslationModel = require('./ComponentTranslationModel');
const ModuleTranslationModel = require('./ModuleTranslationModel');
const logger = require('./logger').buildLogger('componentWrite');

class ComponentWriter {

    constructor(codeGenerator, parentModuleTranslationModel, component) {
        this.codeGenerator = codeGenerator;
        this.parentModuleTranslationModel = parentModuleTranslationModel || new ModuleTranslationModel(component.parentModule);
        this.component = component;
        this.componentTranslationModel = new ComponentTranslationModel(component,  this.parentModuleTranslationModel);
    }

    static buildComponentWriterFactory(codeGenerator, parentModuleTranslationModel) {
        return {
            build: component => new ComponentWriter(codeGenerator, parentModuleTranslationModel, component)
        };
    }

    ensureFolderExists() {
        return new Promise((resolve, reject) => {
            mkdirp(this.componentTranslationModel.filePath, (error, results) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    write() {
        return new Promise((resolve, reject) => {
            this.ensureFolderExists().then(() => {
                let buildPromise = this.buildWritePromise();
                this.handleWritePromise(buildPromise, resolve, reject);
            },(error) => {
                if (error) {
                    logger.log(`Error writing folder for component ${this.component.name}`);
                    logger.log(error);
                    reject(error);
                }
            }).catch(reject);
        });
    }

    buildWritePromise() {
        if(this.componentTranslationModel.parentModuleRelativeLocation === undefined) {
            console.log(`Components ${this.component.parentModule.name} Parent module is undefined!!`)
        }
        return this.codeGenerator.buildComponent(this.component.type, {
            parentModuleRelativeLocation: this.componentTranslationModel.parentModuleRelativeLocation,
            filePath: this.componentTranslationModel.filePath,
            parentModuleName: this.parentModuleTranslationModel.name,
            name: this.component.name,
            dependencies: this.component.dependencies,
            functionImplementation: this.component.functionImplementation,
            valueImplementation: this.component.valueDefinition,
            type: this.component.type
        });
    }

    handleWritePromise(promise, resolve, reject) {
        promise.then(()=> {
            logger.log(`finished writing component ${this.component.name}`);
            resolve();
        }, error => {
            logger.log(`Error writing component ${this.component.name}`);
            if(error && error.stack) {
                logger.log(error.stack);
            } else {
                logger.log(error);
            }

            reject(error);
        });
    }
}

module.exports = ComponentWriter;
'use strict';
const PromiseTracker = require('multi-promise');
const relativeLocation = require('./relativeLocation');
const ModuleTranslationModel = require('./ModuleTranslationModel');
const ComponentWriter = require('./ComponentWriter');
const mkdirp = require('mkdirp');
const logger = require('./logger').buildLogger('moduleWrite');

class ModuleWriter {

    constructor(codeGenerator, module) {
        this.codeGenerator = codeGenerator;
        this.module = module;
        this.moduleTranslationModel = new ModuleTranslationModel(module);
        this.promiseTracker = new PromiseTracker();
    }

    static buildModuleWriterFactory(codeGenerator) {
        return {
            build: moduleDefinition => new ModuleWriter(codeGenerator, moduleDefinition)
        };
    }

    finish() {
        this.promiseTracker.allPromisesGiven = true;
        return this.promiseTracker.promise;
    }

    ensureFolderExists() {
        return new Promise((resolve, reject) => {
            mkdirp(this.moduleTranslationModel.filePath, (error, results) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    writeModule() {
        this.ensureFolderExists().then(() => {

            let buildModulePromise = this.codeGenerator.buildModule({
                moduleName: this.moduleTranslationModel.name,
                fileLocation: this.moduleTranslationModel.filePath,
                dependencyKeys: this.moduleTranslationModel.dependencyKeys,
                imports: this.moduleTranslationModel.importDefinitions
            });

            this.handlePromise('writing module for', buildModulePromise);
        });
    }

    writeModuleExports() {
        this.ensureFolderExists().then(() => {
            let buildPromise = this.codeGenerator.buildModuleExports({
                parentModule: this.module,
                fileLocation: this.moduleTranslationModel.filePath,
                components: this.moduleTranslationModel.components,
                requireFix: this.moduleTranslationModel.tags.vendor
            });

            this.handlePromise('writing module exports for', buildPromise);
        });
    }

    writeModuleComponents() {
        let componentWriterFactory = ComponentWriter.buildComponentWriterFactory(this.codeGenerator, this.moduleTranslationModel);
        this.moduleTranslationModel.components.forEach(component => {
            let componentWriter = componentWriterFactory.build(component);
            let writePromise = componentWriter.write();
            this.promiseTracker.generatePromiseAttachment(writePromise);
        });
    }

    handlePromise(messageBase, promise) {
        let promiseAttachment = this.promiseTracker.generatePromiseAttachment(promise);
        promiseAttachment.then(() => {
            logger.log(`finished ${messageBase} ${this.module.name}`);
        }, error => {
            logger.log(`Error ${messageBase} ${this.module.name}`);
            logger.log(error);
        });
    }
}

module.exports = ModuleWriter;

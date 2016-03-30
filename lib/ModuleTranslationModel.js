'use strict';
const relativeLocation = require('./relativeLocation');
const path = require('path');

class ModuleTranslationModel {
    constructor(module) {
        this.module = module;
        this.filePath = relativeLocation.getNewRelativeLocation(this.module.file, this.module.tags);
        this.name = this.module.name;
        this.tags = this.module.tags;
        this.buildImportDefinitions();
        this.buildComponentsArray();
        this.buildDependencyKeys();
    }

    buildComponentsArray() {
        this.components = [];
        this.module.components.forEach(component => this.components.push(component));
    }

    buildDependencyKeys() {
        if(!this.components) {
            buildComponentsArray();
        }
        this.dependencyKeys = this.components.map( component => component.name);
    }

    buildImportDefinitions() {
        this.importDefinitions = [];

        for (let moduleDependencyKV of this.module.moduleDependencies) {
            let name = moduleDependencyKV[0];
            let moduleDependency = moduleDependencyKV[1];
            let dependenciesNewPath;
            if(moduleDependency) {
                dependenciesNewPath = relativeLocation.getNewRelativeLocation(moduleDependency.file, moduleDependency.tags);
            } else {
                dependenciesNewPath = path.join(this.module.tags.newBase, this.module.tags.relativeRemap, 'importFix');
            }

            this.importDefinitions.push({
                name: name,
                relativeLocation: path.relative(this.filePath, dependenciesNewPath).replace(/\\/gi,'/'),
                moduleDependency
            });
        }
    }
}

module.exports = ModuleTranslationModel;
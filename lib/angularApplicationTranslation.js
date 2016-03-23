'use strict';

const codeGenerator = require('angular-es6-code-generator');
const logger = require('./logger').buildLogger('topLevel');
const ModuleWriter = require('./ModuleWriter');
const ComponentWriter = require('./ComponentWriter');

const moduleWriterFactory = ModuleWriter.buildModuleWriterFactory(codeGenerator);
const componentWriterFactory = ComponentWriter.buildComponentWriterFactory(codeGenerator);

function translate(dependencyTree) {
    let modulePromises = translateModules(dependencyTree);
    let componentPromises = translateComponents(dependencyTree);
    logger.log('translateApplication promise queue built.');

    return Promise.all(modulePromises.concat(componentPromises)).then(result => dependencyTree);
}

function translateModules(dependencyTree) {
    let writePromises = [];
    for(let module of dependencyTree.modules.values()) {
        if(module.defined) {
            writePromises.push(translateModule(module, module.tags.vendor));
        }
    }
    return writePromises;
}

function translateComponents(dependencyTree) {
    let writePromises = [];
    dependencyTree.components.forEach(component => {
        if(!component.parentModule.tags.vendor) {
            writePromises.push(translateComponent(component));
        }
    });
    return writePromises;
}

function translateModule(module, isExternalModule) {
    let moduleWriter = moduleWriterFactory.build(module);

    moduleWriter.writeModuleExports(true);
    if(!isExternalModule) {
        moduleWriter.writeModule(true);
    } else {
        logger.log(`module ${module.name} is external, only writing exports.`);
    }

    return moduleWriter.finish();
}

function translateComponent(component) {
    let componentWriter = componentWriterFactory.build(component);
    return componentWriter.write();
}

module.exports = {
    translate,
    translateModules,
    translateComponents,
    translateModule,
    translateComponent
};
'use strict';

const logger = require('./logger').buildLogger('topLevel');
const dependencyParser = require('angular-dependency-parser');
const nonScriptCopy = require('./nonScriptCopy');
const angularApplicationTranslation = require('./angularApplicationTranslation');

function rewrite(scriptDefinitions) {
    return dependencyParser.convertProjects(scriptDefinitions.directories, scriptDefinitions.definedGlobals)
        .then(dependencyTree => translateApplicationCode(dependencyTree, scriptDefinitions.preferences))
        .then(moveNonApplicationCode);
}

function translateApplicationCode(dependencyTree, preferences) {
    logger.log('Translating Application Code.');

    logModuleSize(dependencyTree);

    return angularApplicationTranslation.translate(dependencyTree, preferences);
}

function logModuleSize(dependencyTree) {
    let componentCount = getComponentCount(dependencyTree);
    logger.log(`generating ${dependencyTree.modules.size} modules and ${componentCount} component source files, total: ${componentCount + dependencyTree.modules.size}`);
}

function getComponentCount(dependencyTree) {
    let componentCount = 0;
    dependencyTree.components.forEach(component => {
        if(!component.parentModule.tags.vendor) { componentCount += 1; }
    });
    return componentCount;
}

function moveNonApplicationCode(dependencyTree) {
    logger.log('writing complete!');
    return moveNonScriptFile(dependencyTree);
}

function moveNonScriptFile(dependencyTree) {
    return nonScriptCopy.moveNonScriptFiles(dependencyTree).then(() => {
        logger.log('copy complete.');
    }, error => {
        console.log('copy error');
        console.log(error.stack);
        throw error;
    }).catch(error => {
        console.log('copy error');
        throw error;
    });
}

module.exports = {
    rewrite,
    translateApplicationCode,
    logModuleSize,
    getComponentCount,
    moveNonApplicationCode,
    moveNonScriptFile
};
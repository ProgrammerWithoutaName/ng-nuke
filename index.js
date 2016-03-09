'use strict';
const dependencyParser = require('angular-dependency-parser');
const codeGenerator = require('angular-es6-code-generator');
const path = require('path');
const fsExtra = require('fs-extra');
const mkdirp = require('mkdirp');
const PromiseTracker = require('multi-promise');
const ModuleWriter = require('./lib/ModuleWriter');
const ComponentWriter = require('./lib/ComponentWriter');
const EventEmitter = require('events');
const logger = require('./lib/logger').buildLogger('topLevel');
const nonScriptCopy = require('./lib/nonScriptCopy');

const baseLocation = path.join(__dirname, 'output');
const moduleWriterFactory = ModuleWriter.buildModuleWriterFactory(codeGenerator);
const componentWriterFactory = ComponentWriter.buildComponentWriterFactory(codeGenerator);

/*
 How it works:
 You can specify either an array of files, or a folder path.
*/

let importedScripts = [ "C:/Path/To/Each/Imported/Normal/Script.js" ];

let directories = [
    {
        folderPath: 'C:/Path/To/Code/app',

        tags: {
            web: true,
            convert: true,
            trackNonScriptFiles: true,
            baseFolder: 'webApp',
            relativeRemap: 'webApp',
            oldBase: 'C:/Path/To/Code/app',
            newBase: baseLocation
        }
    },{
        folderPath: 'C:/Path/To/Code/app',

        tags: {
            common: true,
            convert: true,
            trackNonScriptFiles: true,
            baseFolder: 'commonApp',
            relativeRemap: 'commonApp',
            oldBase: 'C:/Path/To/Code/app',
            newBase: baseLocation
        }
    },
    {
        individualScripts: true,
        filePaths: importedScripts,
        tags: {
            convert: false,
            singleFile: true,
            vendor: true,
            baseFolder: 'webApp',
            relativeRemap: 'webApp/importFix',
            oldBase: 'C:/Path/To/Code/app',
            newBase: baseLocation
        }
    }
];

let error;
let dependencyTree;
let promiseTracker = new PromiseTracker();
let emitter = new EventEmitter();

let dependencyParserPromise = dependencyParser.convertProjects(directories);
let emitParsingComplete = () => emitter.emit('parsingComplete');

dependencyParserPromise.then(results => {
    dependencyTree = results;
    logger.log('emitting parsing complete.');
    emitParsingComplete();
}, reason => {
    error = reason;
    logger.log('Parsing Error');
    logger.log(error);
    process.exit(1);
}).catch(error => {
    logger.log('unhandled exception!');
    logger.log(error.stack);
    process.exit(1);
});



function translateModule(module, isExternalModule) {
    let moduleWriter = moduleWriterFactory.build(module);

    moduleWriter.writeModuleExports(true);
    if(!isExternalModule) {
        moduleWriter.writeModule(true);
    } else {
        logger.log(`module ${module.name} is external, only writing exports.`);
    }

    let writePromise = moduleWriter.finish();
    promiseTracker.generatePromiseAttachment(writePromise);
}

function translateComponent(component) {
    let componentWriter = componentWriterFactory.build(component);
    let writePromise = componentWriter.write();
    promiseTracker.generatePromiseAttachment(writePromise);
}


function startWrite() {
    logger.log('Writing Modules Files.');

    let componentCount = 0;

    dependencyTree.components.forEach(component => {
        if(!component.parentModule.tags.vendor) {
            componentCount += 1;
        }
    });

    logger.log(`generating ${dependencyTree.modules.size} modules and ${componentCount} component source files, total: ${componentCount + dependencyTree.modules.size}`);
    for(let module of dependencyTree.modules.values()) {
        if(module.defined) {
            translateModule(module, module.tags.vendor);
        }
    }

    dependencyTree.components.forEach(component => {
        if(!component.parentModule.tags.vendor) {
            translateComponent(component);
        }
    });

    logger.log('generate Queue Done.');
    promiseTracker.allPromisesGiven = true;

    let emitWritingComplete = () => emitter.emit('writingComplete');
    promiseTracker.promise.then(emitWritingComplete, emitWritingComplete).catch(emitWritingComplete);
}

emitter.on('parsingComplete', function () {
    logger.log('Parsing complete!');
    startWrite();
});

emitter.once('writingComplete', function () {
    logger.log(`writing file ${promiseTracker.resolvedPromiseCount} of ${promiseTracker.totalPromiseCount}, ${promiseTracker.percentComplete}% done.`);
    logger.log('writing complete!');
    nonScriptCopy.moveNonScriptFiles(dependencyTree).then(() => {
        logger.log('copy complete.');
        process.exit(0);
    }, error => {
        console.log('copy error');
        console.log(error.stack);
        process.exit(1);
    }).catch(error => {
        console.log('copy error');
        console.log(error.stack);
        process.exit(1);
    });

});

function waitLoop() {
    setTimeout(waitLoop, 10000);
}

logger.log('starting');
waitLoop();

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



let importedScripts = [
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/Scripts/angularuiselect2/select2.js",
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/Scripts/angular-animate.js",
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/Scripts/angular-file-upload.js",
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/bower_components/angular-ui-router/release/angular-ui-router.js",
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/bower_components/angular-google-analytics/dist/angular-google-analytics.js",
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/bower_components/angular-scroll/angular-scroll.js",
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/Scripts/breeze.angular.js",
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/Scripts/angular-idle.js",
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/Scripts/angular-local-storage.js",
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/Scripts/globalize.js",
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/bower_components/ng-busy/build/angular-busy.js",
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/bower_components/ngQuickDate/dist/ng-quick-date.js",
    "C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/bower_components/angular-bootstrap-show-errors/src/showErrors.js"
];

let adminImportedScripts = [
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/angular-file-upload-shim.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/ng-infinite-scroll.min.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/angular-animate.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/angular-file-upload.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/angular-resource.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/angular-strap.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/angular-strap.tpl.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/breeze.angular.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/textAngular/textAngular-sanitize.min.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/textAngular/textAngular.min.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/bower_components/angular-ui-router/release/angular-ui-router.min.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/jasny-bootstrap.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/ui-sortable/sortable.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/angular-idle.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/Scripts/angular-local-storage.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/bower_components/moment/moment.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/bower_components/ng-busy/build/angular-busy.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/bower_components/angular-loading-bar/build/loading-bar.min.js",
    "C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Admin/bower_components/ngQuickDate/dist/ng-quick-date.js"
];

let directories = [
    {
        folderPath: 'C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/app',

        tags: {
            web: true,
            convert: true,
            trackNonScriptFiles: true,
            baseFolder: 'webApp',
            relativeRemap: 'webApp',
            oldBase: 'C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web',
            newBase: baseLocation
        }
    },{
        folderPath: 'C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Common/app',

        tags: {
            common: true,
            convert: true,
            trackNonScriptFiles: true,
            baseFolder: 'commonApp',
            relativeRemap: 'commonApp',
            oldBase: 'C:/development/olie2/smg.c3.olie2/Sgm.C3.OLIE2.Common',
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
            oldBase: 'C:/development/olie2/smg.c3.olie2/Smg.C3.OLIE2.Web/',
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
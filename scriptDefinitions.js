'use strict';
const path = require('path');
const baseLocation = path.join(__dirname, 'output');

/*
 How it works:
 You can specify either an array of files, or a folder path.
 */

let importedScripts = [
    "C:/Development/refactoring-angular/bower_components/angular-animate/angular-animate.js",
    "C:/Development/refactoring-angular/bower_components/angular-sanitize/angular-sanitize.js",
    "C:/Development/refactoring-angular/bower_components/angular-ui-router/release/angular-ui-router.js"
];
let directories = [
    {
        individualScripts: true,
        filePaths: importedScripts,
        tags: {
            convert: false,
            singleFile: true,
            vendor: true,
            collapse: ['ui.router', 'ngAnimate', 'ngSanitize'],
            baseFolder: 'src',
            relativeRemap: 'src/importFix',
            oldBase: 'C:/Development/refactoring-angular/',
            newBase: baseLocation
        }
    },
    {
        folderPath: 'C:/Development/refactoring-angular/src/',

        tags: {
            web: true,
            convert: true,
            trackNonScriptFiles: true,
            baseFolder: 'src',
            relativeRemap: 'src',
            oldBase: `C:/Development/refactoring-angular`,
            newBase: baseLocation
        }
    }
];

let preferences = {
    indent: { type: 'space', size: 2}
};

module.exports =
{
    preferences,
    directories,
    definedGlobals: [
        'malarkey',
        'moment',
        'toastr',
        'bootstrap',
        'soundcloud'
    ]
};
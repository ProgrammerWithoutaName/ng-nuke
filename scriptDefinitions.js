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
            // convert: if true, then the module and components will be broken out, otherwise it will create a moduleExport
            // in the importFix folder
            convert: false,
            // singleFile defines if we are converting single files or entire directories.
            singleFile: true,
            // useful for tagging if the scripts are part of the project or not. Don't do anything with the tags at the moment.
            vendor: true,
            // this will collapse the modules into a single export module. In the example of ui.router: ui.router has no components defined, but
            // has a number of dependencies that contain the components like $stateProvider and $urlRouterProvider
            collapse: ['ui.router', 'ngAnimate', 'ngSanitize'],
            // folder that everything is based off of. if baseLocation is output, it will base all of the require's off of where things should fall in output/src
            baseFolder: 'src',
            // where to put the scripts given. In the case of single files, folder structure is not maintained, so all the files would go to output/src/importFix
            relativeRemap: 'src/importFix',
            // where the files are based to begin with. Used for determining filelocations for import statements
            oldBase: 'C:/Development/refactoring-angular/',
            // new baseLocation of the files, so if "output" is defined, everything should be place into the output directory
            newBase: baseLocation
        }
    },
    {
        folderPath: 'C:/Development/refactoring-angular/src/',

        tags: {
            web: true,
            convert: true,
            //trackNonScriptFiles will copy all non-script files to their new relative location. It will also move .spec.js files as if they are non script files.
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
    //Code Style Preferences. Right now the only thing we use is indent, more to come in the future.
    preferences,
    // scripts and directories that are to be converted, or have an importFix file added in the case of vendor scripts.
    directories,
    // Globals you use in your script that aren't Angular. They must be defined here or the script will not work.
    definedGlobals: [
        'malarkey',
        'moment',
        'toastr',
        'bootstrap',
        'soundcloud'
    ]
};
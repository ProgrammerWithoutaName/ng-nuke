'use strict';
const path = require('path');
const baseLocation = path.join(__dirname, 'output');

/*
 How it works:
 You can specify either an array of files, or a folder path.
 */

let importedScripts = [ "C:/Development/TestCode/angularblog-master/js/angular-route.js" ];
let directories = [
    {
        individualScripts: true,
        filePaths: importedScripts,
        tags: {
            convert: false,
            singleFile: true,
            vendor: true,
            baseFolder: 'webApp',
            relativeRemap: 'webApp/importFix',
            oldBase: 'C:/Development/TestCode/angularblog-master',
            newBase: baseLocation
        }
    },
    {
        folderPath: 'C:/Development/TestCode/angularblog-master/app',

        tags: {
            web: true,
            convert: true,
            trackNonScriptFiles: true,
            baseFolder: 'webApp',
            relativeRemap: 'webApp',
            oldBase: `C:/Development/TestCode/angularblog-master`,
            newBase: baseLocation
        }
    }
];

module.exports = directories;
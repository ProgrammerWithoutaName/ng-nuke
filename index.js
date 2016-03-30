'use strict';
const appRewriter = require('./lib/appRewriter');
const path = require('path');
const fs = require('fs');
const logger = require('./lib/logger').buildLogger('topLevel');

function nukeApp() {
    let scriptDefinitions = getScriptDefinitions();
    appRewriter.rewrite(scriptDefinitions)
        .then(results => process.exit(0), 
            reason => {
                console.log(`error: ${reason}`);
                if(reason.stack) { console.log(reason.stack); }
                process.exit(1);
            })
        .catch(error=> {
            console.log(`unhandled exception: ${error.message}`);
            console.log(error.stack);
            process.exit(1);
        });
}

function getScriptDefinitions() {
    let scriptDefinitionFilePath = process.argv[2];
    if(fs.existsSync(scriptDefinitionFilePath)) {
        return require(scriptDefinitionFilePath);
    }
    throw new Error(`can not find script definitions "${scriptDefinitionFilePath}"`);
}



function waitLoop() {
    setTimeout(waitLoop, 10000);
}

logger.log('starting');
nukeApp();
waitLoop();

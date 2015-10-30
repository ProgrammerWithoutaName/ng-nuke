'use strict';
const path = require('path');
const fsExtra = require('fs-extra');
const PromiseTracker = require('multi-promise');
const relativeLocation = require('./relativeLocation');
const logger = require('./logger').buildLogger('fileCopy');

function moveNonScriptFiles(moduleMap) {
    return new Promise( (resolve, reject) => {
        logger.log('starting file copy');
        let keys = Object.keys(moduleMap.nonScriptFiles);
        let fileMovePromiseTracker = new PromiseTracker();

        keys.forEach(key => {
            logger.log(`copying ${moduleMap.nonScriptFiles[key].folderItems.length} files for directory ${key}`);
            let tags = moduleMap.nonScriptFiles[key].tags;
            moduleMap.nonScriptFiles[key].folderItems.forEach(folderItem => {
                fileMovePromiseTracker.generatePromiseAttachment(copyFile(folderItem,tags));
            });
        });

        fileMovePromiseTracker.allPromisesGiven = true;
        fileMovePromiseTracker.promise.then(resolve,reject);
    });
}

function copyFile(folderItem, tags) {
    let newPath = relativeLocation.getNewRelativeLocation(folderItem.path, tags);
    let destination = path.join(newPath, folderItem.fileName);
    logger.log(`copying ${folderItem.fileName}`);
    return new Promise((resolve, reject) => {
        fsExtra.ensureDir(newPath, folderError => {
            if(folderError) {
                reject(folderError);
                return;
            }

            fsExtra.copy(folderItem.path, destination, copyError => {
                if(copyError) {
                    reject(copyError);
                    return;
                }
                resolve();
            });
        });
    });
}

module.exports = { copyFile, moveNonScriptFiles };
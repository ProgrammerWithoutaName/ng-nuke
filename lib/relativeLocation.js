'use strict';
const path = require('path');

function getNewRelativeLocation(currentLocation, tags) {
    if(tags.vendor) {
        return path.join(tags.newBase, tags.relativeRemap);
    }
    let newRelativeLocation = path.relative(tags.oldBase, path.dirname(currentLocation));
    let fullPath = path.join(tags.newBase, tags.baseFolder, newRelativeLocation);
    return fullPath;
}

module.exports = {
    getNewRelativeLocation
};

'use strict';

let displayLogTypes = new Set();
displayLogTypes.add('modules');
displayLogTypes.add('components');
displayLogTypes.add('default');
//displayLogTypes.add('moduleWrite');
//displayLogTypes.add('componentWrite');
//displayLogTypes.add('topLevel');
displayLogTypes.add('fileCopy');


function log(message, type) {
    if(displayLogTypes.has(type)) {
        console.log(message);
    }
}

module.exports = {
    log,
    buildLogger: (type) => ({ log: (message) => log(message, type) }),
    addAllowedType: type => displayLogTypes.add(type)
};
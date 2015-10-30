'use strict';
const relativeLocation = require('./relativeLocation');
const path = require('path');

class ComponentTranslationModel {
    constructor(component, parentModuleTranslationModel) {
        this.component = component;
        this.filePath = relativeLocation.getNewRelativeLocation(component.file, parentModuleTranslationModel.tags);
        this.parentModuleRelativeLocation = path.relative(this.filePath, parentModuleTranslationModel.filePath);
    }

}

module.exports = ComponentTranslationModel;
# ng-nuke

Currently this project is a Prototype project. It's goal is to read in Angular components and help organize and detangle a messy project, with the added benefit of setting up the new project using ES6 Modules.

Each Angular module will get broken up into a module definition, a module export definition, and each component. File naming conventions will get applied. It will also marshal external dependencies into a format easily pulled in by the library.

The end solution will most likely not compile- this is mostly a proof of concept project. It will, however, get you fairly close. Since this is more proof of concept, there isn't an interface, to test this out on your project, modify index.js imported scripts and directories.

the output will be put into an output folder- it will just be the equivelent app folder, and not run by itself. From there, you will need to use the framework of choice to enable ES2016 for your site.


How to run:
Create a ScriptDefinition. This will define your project and the external modules your project pulls in. There is an example script definition in the project (scriptDefinition.js).
if you are running this project from this directory, the command to run it would be
(assuming that scriptDefinitions is located in C:\Development\ng-nuke\scriptDefinitions.js)
node index.js C:\Development\ng-nuke\scriptDefinitions.js

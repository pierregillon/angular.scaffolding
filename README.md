#Angular scaffolding project (Typescript)

##Introduction
Building an angular application is not very complex, but there is lots of a plumbing !
This project is a simple scaffolding to help you initialize an angular project from scratch.

##Tooling
The tools used are :
- Karma and jasmine for unit testing
- Gulp for task building
- Eslint for syntax checker

##Plugins used
The most important plugins used are :
* **wiredep**           : browse bower dependencies
* **browser-sync**      : refresh the browser when javascript or html code are modified
* **gulp-watch**        : better than classical gulp.watch(), can watch added and deleted files.
* **gulp-inject**       : inject files on tag in index.html
* **gulp-eslint**       : check syntax of application javascript files
* **gulp-uglify**       : minify javascript files
* **gulp-minify-css**   : minify css files
* **gulp-less**         : transform less files to css files
* **gulp-autoprefixer** : add prefix for css depending on browser versions
* **gulp-rev**          : update distributed file names with revision (checksum)
* **gulp-ng-annotate**  : automatically inject dependency names in functions for safe minification
...

##Package managers
**Npm** and **Bower** are both needed.

Npm is used to download packages that are useful for the project environment plumbing : gulp tasks and karma plugins.
Bower is used to download packages that are required for the web application : angular, lodash, ...

##How to start ?
1 - Clone or copy the full project

2 - Install packages

    npm install
    cd app
    bower install

3 - Install typescript definitions

    cd app
    tsd install
    
4 - Initialize your package.json and bower.json with the right project name, description and version.

    npm init
    cd app
    bower init

5 - Initialize your eslint favourite syntax

    eslint --init
    
6 - Nothing more, you are ready to create your application.

##Overview of the TDD flow
1 - Run the continuous test task
    
    gulp test-w
    
2 - Add your test file, ie : **customer.service.spec.js**

3 - Write your first test, he goes RED

4 - Add your file, ie : **customer.service.js**

5 - Write the appropriate code, the previous test goes GREEN

6 - When you decide, build the application

    gulp build
    
7 - Host your **./dist/index.html** : your application works.

8 - When you want to try the final distributed version, build the minified application

    gulp build-min

##Files organisation

###Source code
The folder *./app/* contains all the source code of the angular application : 
* modules
* configuration
* controllers
* directives
* services
* factories
* html templates

The source code is structured with 1 concept by file. 
Try to follow the [John papa's best practices](https://github.com/johnpapa/angular-styleguide).

###Angular application
The Angular application is initialized with the **ui-router** plugin.

###Unit testing
By default, this scaffolding use Karma with the plugins :
* **Jasmine**   : test description library (describe, it)
* **Chai**      : assertion library : expect(variable).to.be.an('object')
* **Sinon**     : helps you to create spy and stubs : method = sinon.stub().returns(23)

Unit test files end with the *.spec.js* suffix and are located to the same level of the implementation. This
leeds to better navigation between test to implement detail. Honestly, it really saves time.
Example :
* directives
    * mapTitle.directive.js
    * mapTitle.directive.spec.js
    
If you don't like this, just update the *./path.configuration.js* file to choose how to find test files.
        
**Important** : The **./karma.conf.js** file is used by gulp tasks to start test sessions. However, some properties 
are automatically set by those tasks. Changes are ignored for the following properties :
* singleRun
* files
* exclude

###Distrib
The folder *./dist/* contains the built application files : 
* **application.js**    : aggregation of all the javascript files of the application
* **application.css**   : aggregation of all the css files and transformed less files of the application
* **templates.js**      : aggregation of all the html files into the angular template cache
* **libraries.js**      : aggregation of all bower dependency javascript files
* **libraries.cs**      : aggregation of all bower dependency css files
* **index.html**        : the index page that contains references to other files
* **img/**              : the folder that contains all the images of the application

Those files are generated with gulp tasks from source code of the *./app/* folder.
Currently, the files that are used to generate the distribution files are :
* .js
* .css
* .less
* .html
* all image files in the **app/img/** folder

##All gulp tasks
You can list available gulp tasks with :

    gulp help

**Gulp tasks for building application**
* **build**        : Build the entire application in the dist folder.
* **build-min**    : Build the entire minified application in the dist folder.
* **build-min-w**  : Build the entire minified application in the dist folder and watch changes. Browser-sync is used to refresh the browser.
* **build-w**      : Build the entire application in the dist folder and watch changes. Browser-sync is used to refresh the browser.
* **clean**        : Clean the dist folder.

**Gulp tasks for testing :**
* **test**         : Start a single run of all unit tests.
* **test-debug**   : Start a debug session of all unit tests.
* **test-dist**    : Start a single run of all unit tests, based on the full minified built application in the dist folder.
* **test-w**       : Start a continuous run of all unit tests.
* **test-c**       : Start a single run of all unit tests and build a coverage summary.

##Gulp task configuration
All the gulp tasks are configured with the *./path.configuration.js*. You can update the configuration to your needs :
where files are located, output file names, ...

##What's next ?
Save time with less plumbing.
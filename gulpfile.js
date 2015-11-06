(function(require){
    'use strict';

    var configuration = require('./gulp/gulp.configuration.json');
    require('./gulp/gulp.build.js')(configuration);
    require('./gulp/gulp.test.js')(configuration);

}(require));
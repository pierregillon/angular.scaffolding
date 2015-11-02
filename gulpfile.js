(function(require){
    'use strict';

    var parameters = require('./gulp/gulp.parameters.js');
    require('./gulp/gulp.build.js')(parameters);
    require('./gulp/gulp.test.js')(parameters);

}(require));
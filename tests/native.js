var Q = require('../dist/Q.native'),
    utils = require('../src/core/utils'),
    _ = require('../src/adapter/utils.native');

require('./spec/data')(Q);
require('./spec/class')(Q);
require('./spec/directive')(Q);

// extend _
_.extend(utils, _);
require('./utils/utils')(utils);



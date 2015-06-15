var Q = require('../src/Q'),
    utils = require('../src/core/utils'),
    _ = require('../src/adapter/utils.jquery');

require('./spec/data')(Q);
require('./spec/class')(Q);
require('./spec/directive')(Q);


_.extend(utils, _);
require('./utils/utils')(utils);
require('./utils/cache');
require('./utils/data');

var Q = require('../src/Q'),
    utils = require('../src/core/utils'),
    _ = require('../src/adapter/utils.jquery');

require('./spec/data')(Q);
require('./spec/class')(Q);
require('./spec/directive')(Q);
require('./spec/repeat')(Q);
require('./spec/filters')(Q);
require('./spec/cloak')(Q);


_.extend(utils, _);
require('./utils/utils')(utils);
require('./utils/cache');
require('./utils/data');
require('./utils/events');
require('./utils/parse');

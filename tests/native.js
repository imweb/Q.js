var Q = require('../src/Q.native'),
    utils = require('../src/core/utils'),
    _ = require('../src/adapter/utils.native');

require('./spec/data')(Q);
require('./spec/class')(Q);
require('./spec/directive')(Q);
require('./spec/repeat')(Q);
require('./spec/model')(Q);
require('./spec/filters')(Q);
require('./spec/alpaca')(Q);
require('./spec/cloak')(Q);

// extend _
_.extend(utils, _);
require('./utils/utils')(utils);
require('./utils/cache');
require('./utils/data');
require('./utils/events');
require('./utils/parse');



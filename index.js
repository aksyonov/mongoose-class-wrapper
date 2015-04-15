module.exports = require('./lib');
module.exports.Model = require('./lib/model.js').Model;
var decorators = require('./lib/decorators.js');
module.exports.mongooseModel = decorators.mongooseModel;
module.exports.plugin = decorators.plugin;
module.exports.index = decorators.index;
module.exports.post = decorators.post;
module.exports.pre = decorators.pre;

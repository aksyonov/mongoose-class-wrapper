# mongoose-class-wrapper [![Build Status][travis-image]][travis-url]
Tiny ES6 class-based wrapper for mongoose model methods.

## Installation

```
$ npm i mongoose mongoose-class-wrapper --save
```

## Usage

Designed to use with [babel][babel-url] or io.js (with `--es_staging` flag).

Example:
```js
var mongoose = require('mongoose');
var loadClass = require('mongoose-class-wrapper');


// Create mongoose schema
var userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  email: {type: String, unique: true, required: true},
  hashedPassword: {type: String, required: true},
  salt: {type: String, required: true},
  created: {type: Date, default: Date.now}
});

// Create new class with model methods
class UserModel {

  get password() {
    return this._plainPassword;
  }
  set password(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  }

  encryptPassword(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  }

  static byEmail(email) {
    return this.findOne({email}).exec();
  }

}

// Add methods from class to schema using plugin syntax
userSchema.plugin(loadClass, UserModel);
// OR you can use this function directly
// loadClass(userSchema, UserModel);


// Export mongoose model
module.exports = mongoose.model('User', userSchema);
```

## Usage with ES7 decorators (experimental)

This library supports [ES7 decorators proposal][decorators-url] which is supported by babel. To use it you should enable experimental `es7.decorators` feature in babel as described [here][babel-experimental-url].

**Note**: If [ES7 decorators proposal][decorators-url] or it's support in babel will be changed or removed, it's support in this library will be changed or removed as well.

Example (simple):
```js
var mongoose = require('mongoose');
var loadClass = require('mongoose-class-wrapper');

var userSchema = new mongoose.Schema({
  // schema definition
});

@loadClass(userSchema)
class User {
  // class methods
}

module.exports = mongoose.model('User', userSchema);
```

Example (full usage of decorator):
```js
var mongooseModel = require('mongoose-class-wrapper').mongooseModel;

@mongooseModel({
  // schema definition
  name: String,
  type: String
}, {
  // mongoose schema options
  autoIndex: false
}, (schema) => {
  // configuration function
  schema.index({name: 1, type: -1});
})
class User {
  // class methods
}

// Export mongoose model
module.exports = User;
```

First two parameters (second is optional) are arguments for [mongoose.Schema][mongoose-schema-url].
Last optional parameter is function for configuring schema. Some schema methods (create indexes, register plugins, etc.) should be called before model is created, you can do it in this function. It will be called with one argument = mongoose schema.


## License
This library is under the [MIT License][mit-url]


[travis-image]: https://img.shields.io/travis/aksyonov/mongoose-class-wrapper/master.svg
[travis-url]: https://travis-ci.org/aksyonov/mongoose-class-wrapper
[babel-url]: http://babeljs.io/
[decorators-url]: https://github.com/wycats/javascript-decorators
[babel-experimental-url]: https://babeljs.io/docs/usage/experimental/#usage
[mongoose-schema-url]: http://mongoosejs.com/docs/guide.html#definition
[mit-url]: http://opensource.org/licenses/MIT

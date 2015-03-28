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

## License
This library is under the [MIT License][mit-url]


[travis-image]: https://img.shields.io/travis/aksyonov/mongoose-class-wrapper/master.svg
[travis-url]: https://travis-ci.org/aksyonov/mongoose-class-wrapper
[babel-url]: http://babeljs.io/
[mit-url]: http://opensource.org/licenses/MIT

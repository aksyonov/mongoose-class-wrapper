# mongoose-class-wrapper [![Build Status][travis-image]][travis-url]
Tiny ES2015 class-based wrapper for mongoose model methods.

**Note: Since [v4.7.0](https://github.com/Automattic/mongoose/blob/master/History.md#470--2016-11-23), Mongoose already supports ES2015 classes ([PR reference](https://github.com/Automattic/mongoose/pull/4668)).**

## Installation

```
$ npm i mongoose mongoose-class-wrapper --save
```

## Usage

You can use this plugin with latest Node.js versions (at least v4 LTS) as they support ES2015 class syntax (in strict mode). For previous versions use [babel][babel-url].

### Basic Example

```js
// Importing modules
const mongoose = require('mongoose');
const loadClass = require('mongoose-class-wrapper');
//   for babel:
// import mongoose from 'mongoose';
// import loadClass from 'mongoose-class-wrapper';
//   for typescript:
// import * as mongoose from 'mongoose';
// import loadClass = require('mongoose-class-wrapper');


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

//posible options, for instance if you want to ignore getter and setters put
const options={
	ignoreGettersAndSetters:true
}

// Add methods from class to schema
userSchema.plugin(loadClass, {target:UserModel,options:options});

// Export mongoose model
export default mongoose.model('User', userSchema);
```

### Inheritance Example

```js
import mongoose from 'mongoose';
import loadClass from 'mongoose-class-wrapper';

class Resource {}

// Add schema to base class
Resource.schema = {
  version: {
    type: Number,
    default: 0
  }
}

// Add hooks to base class
Resource.hooks = {
  pre: {
    save: function(next) {
      this.version += 1;
      next();
    }
  }
}

var schema = new mongoose.Schema({
  title: String,
  author: String
});

class Book extends Resource {}

// Add schema, hooks and methods from class to schema
schema.plugin(loadClass, Book);

// Export mongoose model
export default mongoose.model('Book', schema);

```

## Experimental decorators

Experimental decorators for mongoose models are available in [mongoose-decorators][mongoose-decorators-url] package.

## License
This library is under the [MIT License][mit-url]


[travis-image]: https://img.shields.io/travis/aksyonov/mongoose-class-wrapper/master.svg
[travis-url]: https://travis-ci.org/aksyonov/mongoose-class-wrapper
[babel-url]: http://babeljs.io/
[decorators-url]: https://github.com/wycats/javascript-decorators
[mongoose-decorators-url]: https://github.com/aksyonov/mongoose-decorators
[mit-url]: http://opensource.org/licenses/MIT

import mongoose from 'mongoose';
import loadClass from '../';

describe('loadClass', function () {
  beforeEach(function () {
    mongoose.models = {};
    this.schema = new mongoose.Schema({name: String, pass: String});
  });

  describe('initialization', function () {
    it('should support plugin syntax', function () {
      class UserModel {
        foo() {}
      }
      this.schema.plugin(loadClass, UserModel);
      let User = mongoose.model('User', this.schema);

      expect(User.modelName).to.eql('User');
      expect(User).to.respondTo('foo');
    });

    it('should support direct function call', function () {
      class UserModel {
        foo() {}
      }
      loadClass(this.schema, UserModel);
      let User = mongoose.model('User', this.schema);

      expect(User.modelName).to.eql('User');
      expect(User).to.respondTo('foo');
    });

    it('should register static methods in model', function () {
      class UserModel {
        static register() {}
      }
      loadClass(this.schema, UserModel);
      let User = mongoose.model('User', this.schema);

      expect(User).itself.to.respondTo('register');
    });

    it('should register instance methods in model', function () {
      class UserModel {
        encryptPassword() {}
      }
      loadClass(this.schema, UserModel);
      let User = mongoose.model('User', this.schema);

      expect(User).to.respondTo('encryptPassword');
    });

    it('should register getters in model', function () {
      class UserModel {
        get password() { return 'encrypted' }
      }
      loadClass(this.schema, UserModel);
      let User = mongoose.model('User', this.schema);

      expect(new User().password).to.eql('encrypted');
    });

    it('should register setters in model', function () {
      class UserModel {
        set password(value) { this._pass = value }
      }
      loadClass(this.schema, UserModel);
      let User = mongoose.model('User', this.schema);
      let user = new User({password: 'pass'});

      expect(user._pass).to.eql('pass');
    });

    it('should register static getters in model', function () {
      class UserModel {
        static get maxUsers() { return 100; }
      }
      loadClass(this.schema, UserModel);
      let User = mongoose.model('User', this.schema);

      expect(new User().maxUsers).to.eql(100);
    });

    it('should register setters in model', function () {
      class UserModel {
        static set maxUsers(value) { this._maxUsers = value; }
      }
      loadClass(this.schema, UserModel);
      let User = mongoose.model('User', this.schema);
      let user = new User({password: 'pass'});
      user.maxUsers = 100;
      expect(user._maxUsers).to.eql(100);
    });
  });
});

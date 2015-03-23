import mongoose from 'mongoose';
import {Model} from '../';
import {sinonSetup} from './test-helper';


const SCHEMA = {name: String, pass: String};

describe('Model', function () {
  beforeEach(function () {
    mongoose.models = {};
  });

  describe('initialization', function () {
    it('should contain mongoose model', function () {
      class UserModel extends Model {}
      let {User} = new UserModel(SCHEMA);

      expect(User.modelName).to.eql('User');
    });

    it('should register static methods in model', function () {
      class UserModel extends Model {
        static register() {}
      }
      let {User} = new UserModel(SCHEMA);

      expect(User).itself.to.respondTo('register');
    });

    it('should register instance methods in model', function () {
      class UserModel extends Model {
        encryptPassword() {}
      }
      let {User} = new UserModel(SCHEMA);

      expect(User).to.respondTo('encryptPassword');
    });

    it('should register getters in model', function () {
      class UserModel extends Model {
        get password() { return 'encrypted' }
      }
      let {User} = new UserModel(SCHEMA);

      expect(new User().password).to.eql('encrypted');
    });

    it('should register setters in model', function () {
      class UserModel extends Model {
        set password(value) { this._pass = value }
      }
      let {User} = new UserModel(SCHEMA);
      let user = new User({password: 'pass'});

      expect(user._pass).to.eql('pass');
    });

    it("throws error if schema object is not present", function () {
      class User extends Model {}
      expect(() => {
        new User();
      }).to.throw('You should provide schema definition object to model.');
    });

    it("doesn't accept class name without 'Model' at the end", function () {
      class User extends Model {}
      expect(() => {
        new User({});
      }).to.throw("Model class name must end with 'Model'.");
    });
  });

  describe('configuration', function () {
    sinonSetup();

    it("should run `configure` method if it's present", function () {
      class UserModel extends Model {}
      let configure = UserModel.prototype.configure = this.sinon.spy();
      let {User} = new UserModel(SCHEMA);

      expect(configure).to.have.been.calledWith(User.schema);
    });

    it('should not register `configure` as instance method', function () {
      class UserModel extends Model {
        configure() {}
      }
      let {User} = new UserModel(SCHEMA);

      expect(User).to.not.respondTo('configure');
    });
  });
});

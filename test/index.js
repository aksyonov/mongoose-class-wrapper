import mongoose from 'mongoose';
import loadClass from '../src';

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

    it('should support schema attribute', function () {
      class UserModel {}
      UserModel.schema = { age: Number }
      loadClass(this.schema, UserModel);
      let User = mongoose.model('User', this.schema);
      let user = new User({ name: 'Henry', age: 24 })

      expect(user.name).to.equal('Henry')
      expect(user.age).to.equal(24)
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
  });

  describe('inheritance', function () {
    class Resource {
      foo() {
        return 'foo';
      }

      static list() {
        return [1, 2];
      }
    }

    Resource.schema = {
      version: {
        type: Number,
        default: 0
      }
    }

    it('should register base class schema', function () {
      class Book extends Resource {}

      loadClass(this.schema, Book);
      let BookModel = mongoose.model('Book', this.schema);
      let book = new BookModel();

      expect(book.version).to.equal(0)
    });

    it('should register base class methods', function () {
      class Book extends Resource {}

      loadClass(this.schema, Book);
      let BookModel = mongoose.model('Book', this.schema);
      let book = new BookModel();

      expect(book.foo()).to.eq('foo');
      expect(BookModel.list()).to.eql([1, 2]);
    });

    it('should allow using super in methods', function () {
      class Book extends Resource {
        foo() {
          return `${super.foo()}bar`;
        }

        static list() {
          return super.list().concat(3, 4);
        }
      }

      loadClass(this.schema, Book);
      let BookModel = mongoose.model('Book', this.schema);
      let book = new BookModel();

      expect(book.foo()).to.eq('foobar');
      expect(BookModel.list()).to.eql([1, 2, 3, 4]);
    });
  });
});

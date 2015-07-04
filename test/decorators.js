import mongoose from 'mongoose';
import sinon from "sinon";
import {mongooseModel, index, plugin, post, pre} from '../';

describe('mongooseModel decorator', function () {
  beforeEach(function () {
    mongoose.models = {};
  });

  it('should return mongoose model', function () {
    @mongooseModel({name: String})
    class User {
      foo() {}
    }

    expect(User.modelName).to.eql('User');
    expect(User).to.respondTo('foo');
  });

  it('should accept schema options', function () {
    @mongooseModel({name: String}, {collection: 'data'})
    class User {}

    expect(User.schema.options.collection).to.eq('data');
  });

  it('should configure model', function () {
    @mongooseModel({
      name: String
    }, schema => {
      schema.method('bar', () => {});
    })
    class User {}

    expect(User).to.respondTo('bar');
  });

  it('should sccept options and configure method at the same time', function () {
    @mongooseModel({
      name: String
    }, {
      collection: 'data'
    }, schema => {
      schema.method('bar', () => {});
    })
    class User {}

    expect(User.schema.options.collection).to.eq('data');
    expect(User).to.respondTo('bar');
  });
});

describe('other decorators', function () {
  beforeEach(function () {
    mongoose.models = {};
  });

  describe('@index', function () {
    it('should register compound index', function () {
      @mongooseModel({name: String, email: String})
      @index({name: 1, email: -1})
      class User {}

      expect(User.schema._indexes[0][0]).to.eql({name: 1, email: -1});
    });
  });

  describe('@plugin', function () {
    it('should register plugin', function () {
      const testPlugin = sinon.spy();
      @mongooseModel({name: String, email: String})
      @plugin(testPlugin)
      class User {}

      expect(testPlugin).to.have.been.calledWith(User.schema);
    });
  });

  describe('@pre, @post', function () {
    it('should register function as hook', function () {
      const testHook = sinon.spy(next => next());
      @mongooseModel({name: String, email: String})
      @pre('validate', testHook)
      class User {}

      for (let i = 0; i < 2; i++) new User({name: 'Jon'}).validate();

      expect(testHook).to.have.been.calledTwice;
    });

    it('should register class method as hook', function () {
      @mongooseModel({name: String, email: String})
      @post('validate', 'hook')
      class User {
        hook() {
          this.validated = true;
        }
      }

      let user = new User({name: 'Jon'})
      user.validate();
      expect(user.validated).to.be.true;
    });

    it('should decorate a method', function () {
      @mongooseModel({name: String, email: String})
      class User {
        @post('validate')
        hook() {
          this.validated = true;
        }
      }

      let user = new User({name: 'Jon'})
      user.validate();
      expect(user.validated).to.be.true;
    });
  });
});

import mongoose from 'mongoose';
import {mongooseModel} from '../';

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
    @mongooseModel({
      name: String
    }, {
      collection: 'data'
    })
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

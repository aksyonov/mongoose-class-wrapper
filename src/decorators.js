import mongoose from 'mongoose';
import loadClass from './index.js';


function schemaDecorator(name, args) {
  return (target) => {
    if (!target._configure) target._configure = [];
    target._configure.push(schema => schema[name](...args));
  };
}

function schemaHookDecorator(name, [hook, fn]) {
  if (typeof fn == 'string') {
    const method = fn;
    fn = function (...args) {
      return this[method](...args);
    };
  }
  return schemaDecorator(name, [hook, fn]);
}

export function mongooseModel(schemaDef, options, configure) {
  if (typeof options == 'function' && configure === undefined) {
    [options, configure] = [{}, options];
  }

  let schema = new mongoose.Schema(schemaDef, options);

  return (target) => {
    if (configure) configure(schema);
    if (target._configure) target._configure.forEach(func => func(schema));

    loadClass(schema, target);
    return mongoose.model(target.name, schema);
  };
}

export function index(...args) {
  return schemaDecorator('index', args);
}

export function plugin(...args) {
  return schemaDecorator('plugin', args);
}

export function post(...args) {
  return schemaHookDecorator('post', args);
}

export function pre(...args) {
  return schemaHookDecorator('pre', args);
}

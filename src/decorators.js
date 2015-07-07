'use strict';
import {deprecate} from 'util';
import mongoose from 'mongoose';
import loadClass from './index.js';

let message = "[mongoose-class-wrapper] ES7 Decorators are available in 'mongoose-decorators' package.";

function schemaDecorator(name, args) {
  return (target) => {
    if (!target._configure) target._configure = [];
    target._configure.push(schema => schema[name](...args));
  };
}

function schemaHookDecorator(name, [hook, fn]) {
  if (typeof fn === 'string') {
    const method = fn;
    fn = function (...args) {
      return this[method](...args);
    };
  }
  if (fn) return schemaDecorator(name, [hook, fn]);

  return (target, key, descriptor) => {
    schemaDecorator(name, [hook, descriptor.value])(target.constructor);
  };
}

export var mongooseModel = deprecate(function mongooseModel(schemaDef, options, configure) {
  if (typeof options === 'function' && configure === undefined) {
    [options, configure] = [{}, options];
  }

  let schema = new mongoose.Schema(schemaDef, options);

  return (target) => {
    if (configure) configure(schema);
    if (target._configure) target._configure.forEach(func => func(schema));

    loadClass(schema, target);
    return mongoose.model(target.name, schema);
  };
}, message);

export var index = deprecate(function index(...args) {
  return schemaDecorator('index', args);
}, message);

export var plugin = deprecate(function plugin(...args) {
  return schemaDecorator('plugin', args);
}, message);

export var post = deprecate(function post(...args) {
  return schemaHookDecorator('post', args);
}, message);

export var pre = deprecate(function pre(...args) {
  return schemaHookDecorator('pre', args);
}, message);

import {deprecate} from 'util';
import mongoose from 'mongoose';
import loadClass from './index.js';

let message = '[mongoose-class-wrapper] Model syntax is deprecated. Please check out readme and use new syntax instead.';

let initModel = deprecate(function initModel(schemaDef) {
  if (!schemaDef) {
    throw "You should provide schema definition object to model.";
  }

  let proto = this.constructor.prototype;
  let schema = this.schema = new mongoose.Schema(schemaDef);
  let match = this.constructor.name.match(/^(.+?)Model$/);
  if (!match || match.length < 2) {
    throw "Model class name must end with 'Model'.";
  }
  let name = this.name = match[1];

  if (proto.configure) {
    proto.configure(schema);
    proto.configure = null;
  }

  loadClass(schema, this.constructor);

  this[name] = this.model = mongoose.model(this.name, schema);
}, message);

export class Model {

  constructor(schemaDef) {
    initModel.call(this, schemaDef);
  }

}

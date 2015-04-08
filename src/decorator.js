import mongoose from 'mongoose';
import loadClass from './index.js';


export function mongooseModel(schemaDef, options, configure) {
  if (typeof options == 'function' && configure === undefined) {
    [options, configure] = [{}, options];
  }

  let schema = new mongoose.Schema(schemaDef, options);

  if (configure) configure(schema);

  return (klass) => {
    loadClass(schema, klass);
    return mongoose.model(klass.name, schema);
  };
}

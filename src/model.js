import mongoose from 'mongoose';


export class Model {

  constructor(schemaDef) {
    if (!schemaDef) {
      throw "You should provide schema definition object to model.";
    }
    let staticObj = this.constructor;
    let instanceObj = this.constructor.prototype;
    let staticProps = Object.getOwnPropertyNames(staticObj);
    let prototypeProps = Object.getOwnPropertyNames(instanceObj);
    let instanceProps = prototypeProps.filter(name => {
      return ['constructor', 'configure'].indexOf(name) == -1;
    });

    let schema = this.schema = new mongoose.Schema(schemaDef);
    let match = this.constructor.name.match(/^(.+?)Model$/);
    if (!match || match.length < 2) {
      throw "Model class name must end with 'Model'.";
    }
    let name = this.name = match[1];


    staticProps.forEach(name => {
      let method = Object.getOwnPropertyDescriptor(staticObj, name);
      if (typeof method.value == 'function') schema.static(name, method.value);
    });

    instanceProps.forEach(name => {
      let method = Object.getOwnPropertyDescriptor(instanceObj, name);
      if (typeof method.value == 'function') schema.method(name, method.value);
      if (typeof method.get == 'function') schema.virtual(name).get(method.get);
      if (typeof method.set == 'function') schema.virtual(name).set(method.set);
    });

    if (this.configure) this.configure(schema);

    this[name] = this.model = mongoose.model(this.name, schema);
  }

}

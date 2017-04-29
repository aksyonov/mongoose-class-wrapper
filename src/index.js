'use strict';

function wrap(schema,params, hooks = []) {
  let {options={},target=params} = params;
  let proto = target.prototype;
  let parent = Object.getPrototypeOf(target);
  let staticProps = Object.getOwnPropertyNames(target);
  let prototypeProps = Object.getOwnPropertyNames(proto);
  let instanceProps = prototypeProps.filter(name => name !== 'constructor');

  // Wrap parent first
  if (parent.name) wrap(schema, parent, hooks);

  // Add model schema
  if (target.schema && typeof target.schema == 'object') {
    schema.add(target.schema);
  }

  // Add middleware hooks
  if (target.hooks && typeof target.hooks == 'object') {
    for (let hookType in target.hooks){
      for (let hookAction in target.hooks[hookType]){
        let hook = target.hooks[hookType][hookAction];
        let index = hooks.indexOf(hook);
        if (index < 0){
          hooks.push(hook);
          schema[hookType](hookAction, hook);
        }
      }
    }
  }

  // Add static methods
  staticProps.forEach(name => {
    let method = Object.getOwnPropertyDescriptor(target, name);
    if (typeof method.value == 'function') schema.static(name, method.value);
  });

  // Add methods and virtuals
  instanceProps.forEach(name => {
    let method = Object.getOwnPropertyDescriptor(proto, name);
    if (typeof method.value == 'function') schema.method(name, method.value);
    if (!options.ignore_getters_and_setters){
      if (typeof method.get == 'function') schema.virtual(name).get(method.get);
      if (typeof method.set == 'function') schema.virtual(name).set(method.set);
    }
    
  });
}

module.exports = wrap;

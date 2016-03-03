'use strict';

function wrap(schema, target) {
  let proto = target.prototype;
  let parent = Object.getPrototypeOf(target);
  let staticProps = Object.getOwnPropertyNames(target);
  let prototypeProps = Object.getOwnPropertyNames(proto);
  let instanceProps = prototypeProps.filter(name => name !== 'constructor');

  if (parent.name) wrap(schema, parent);

  staticProps.forEach(name => {
    let method = Object.getOwnPropertyDescriptor(target, name);
    if (typeof method.value == 'function') schema.static(name, method.value);
  });

  instanceProps.forEach(name => {
    let method = Object.getOwnPropertyDescriptor(proto, name);
    if (typeof method.value == 'function') schema.method(name, method.value);
    if (typeof method.get == 'function') schema.virtual(name).get(method.get);
    if (typeof method.set == 'function') schema.virtual(name).set(method.set);
  });
}

module.exports = wrap;

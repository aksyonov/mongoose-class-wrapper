'use strict';

function wrap(schema, klass) {
  let proto = klass.prototype;
  let staticProps = Object.getOwnPropertyNames(klass);
  let prototypeProps = Object.getOwnPropertyNames(proto);
  let instanceProps = prototypeProps.filter(name => name !== 'constructor');

  let processVirtual = (name, method) => {
    if (typeof method.get == 'function') schema.virtual(name).get(method.get);
    if (typeof method.set == 'function') schema.virtual(name).set(method.set);
  };

  staticProps.forEach(name => {
    let method = Object.getOwnPropertyDescriptor(klass, name);
    if (typeof method.value == 'function') schema.static(name, method.value);
    processVirtual(name, method);
  });

  instanceProps.forEach(name => {
    let method = Object.getOwnPropertyDescriptor(proto, name);
    if (typeof method.value == 'function') schema.method(name, method.value);
    processVirtual(name, method);
  });
}

export default function loadClass(schema, klass) {
  if (klass) {
    wrap(schema, klass);
  } else {
    return (klass) => wrap(schema, klass);
  }
}

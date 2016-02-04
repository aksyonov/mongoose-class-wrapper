'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadClass;
function wrap(schema, klass) {
  var proto = klass.prototype;
  var staticProps = Object.getOwnPropertyNames(klass);
  var prototypeProps = Object.getOwnPropertyNames(proto);
  var instanceProps = prototypeProps.filter(function (name) {
    return name !== 'constructor';
  });

  var processVirtual = function processVirtual(name, method) {
    if (typeof method.get == 'function') schema.virtual(name).get(method.get);
    if (typeof method.set == 'function') schema.virtual(name).set(method.set);
  };

  staticProps.forEach(function (name) {
    var method = Object.getOwnPropertyDescriptor(klass, name);
    if (typeof method.value == 'function') schema.static(name, method.value);
    processVirtual(name, method);
  });

  instanceProps.forEach(function (name) {
    var method = Object.getOwnPropertyDescriptor(proto, name);
    if (typeof method.value == 'function') schema.method(name, method.value);
    processVirtual(name, method);
  });
}

function loadClass(schema, klass) {
  if (klass) {
    wrap(schema, klass);
  } else {
    return function (klass) {
      return wrap(schema, klass);
    };
  }
}
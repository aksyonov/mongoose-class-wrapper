'use strict';

function wrap(schema, target) {
  var proto = target.prototype;
  var parent = Object.getPrototypeOf(target);
  var staticProps = Object.getOwnPropertyNames(target);
  var prototypeProps = Object.getOwnPropertyNames(proto);
  var instanceProps = prototypeProps.filter(function (name) {
    return name !== 'constructor';
  });

  if (parent.name) wrap(schema, parent);

  // Add model schemas
  if (target.schema && typeof target.schema == 'object') {
    schema.add(target.schema);
  }

  // Add middleware hooks
  if (target.hooks && typeof target.hooks == 'object') {
    target.hooks.pre = target.hooks.pre || [];
    target.hooks.pre.forEach(function(hook) {hook(schema.pre.bind(schema))})
    target.hooks.post = target.hooks.post || [];
    target.hooks.post.forEach(function(hook) {hook(schema.post.bind(schema))})
  }

  // Add static methods
  staticProps.forEach(function (name) {
    var method = Object.getOwnPropertyDescriptor(target, name);
    if (typeof method.value == 'function') schema.static(name, method.value);
  });

  // Add methods and virtuals
  instanceProps.forEach(function (name) {
    var method = Object.getOwnPropertyDescriptor(proto, name);
    console.log(name,method);
    if (typeof method.value == 'function') schema.method(name, method.value);
    if (typeof method.get == 'function') schema.virtual(name).get(method.get);
    if (typeof method.set == 'function') schema.virtual(name).set(method.set);
  });
}

module.exports = wrap;
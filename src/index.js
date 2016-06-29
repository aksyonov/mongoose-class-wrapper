'use strict';

function wrap(schema, target, hooks) {
  hooks = hooks || [];
  var proto = target.prototype;
  var parent = Object.getPrototypeOf(target);
  var staticProps = Object.getOwnPropertyNames(target);
  var prototypeProps = Object.getOwnPropertyNames(proto);
  var instanceProps = prototypeProps.filter(function (name) {
    return name !== 'constructor';
  });

  // Wrap parent first
  if (parent.name){
    wrap(schema, parent, hooks);
  }

  // Add model schemas
  if (target.schema && typeof target.schema == 'object') {
    schema.add(target.schema);
  }

  // Only add a hook if it has not already been added
  function add_hook(type, hook){
    let index = hooks.indexOf(hook);
    if (index < 0){
      hooks.push(hook)
      hook(schema[type].bind(schema))
    }
  }

  // Add middleware hooks
  if (target.hooks && typeof target.hooks == 'object') {
    target.hooks.pre = target.hooks.pre || [];
    target.hooks.pre.forEach(function(hook) {add_hook('pre',hook)})
    target.hooks.post = target.hooks.post || [];
    target.hooks.post.forEach(function(hook) {add_hook('post',hook)})
  }

  // Add static methods
  staticProps.forEach(function (name) {
    var method = Object.getOwnPropertyDescriptor(target, name);
    if (typeof method.value == 'function') schema.static(name, method.value);
  });

  // Add methods and virtuals
  instanceProps.forEach(function (name) {
    var method = Object.getOwnPropertyDescriptor(proto, name);
    if (typeof method.value == 'function') schema.method(name, method.value);
    if (typeof method.get == 'function') schema.virtual(name).get(method.get);
    if (typeof method.set == 'function') schema.virtual(name).set(method.set);
  });
}

module.exports = wrap;
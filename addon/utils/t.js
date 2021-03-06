import Ember from 'ember';

var fmt = Ember.String.fmt;
var get = Ember.get;
var bind = Ember.run.bind;

import { read, readArray } from 'ember-cli-i18n/utils/stream';

function T(attributes) {
  for(var key in attributes) {
    this[key] = attributes[key];
  }
  this.t = function(path, values) {
    var application = this.container.lookup('application:main');
    var countryCode = application.localeStream.value();
    var locale;
    var result;

    if (!Ember.isArray(values)) {
      values = Array.prototype.slice.call(arguments, 1);
    }

    if (countryCode) {
      locale = this.lookupLocale(countryCode);
    }

    if (!locale) {
      countryCode = application.defaultLocale;
      locale = this.lookupLocale(countryCode);
    }

    result = get(locale, read(path));

    return fmt(result, readArray(values));
  };

  this.lookupLocale = function(countryCode) {
    return this.container.lookupFactory('locale:' + countryCode);
  };
}

T.create = function(attributes) {
  var t = new T(attributes);
  var fn = bind(t, t.t);
  fn.destroy = function() {};
  return fn;
};

export default T;

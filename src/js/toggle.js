'use strict';

var dom = require('./dom');

var TOGGLE_CLASS = 'is_active';

var toggle = {
  init: function(el, onLink, offLink) {
    dom.listen(onLink, 'click', function(ev) {
      ev.preventDefault();
      dom.addClass(el, TOGGLE_CLASS);
    });
    dom.listen(offLink, 'click', function(ev) {
      ev.preventDefault();
      dom.removeClass(el, TOGGLE_CLASS);
    });
  }
};

module.exports = toggle;

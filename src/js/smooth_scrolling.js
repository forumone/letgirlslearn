'use strict';

var dom = require('./dom');

var DURATION = 1000;

var smooth = {
  init: function(root, els) {
    var self = this;
    this.root = root;
    Array.prototype.forEach.call(els, function(el){
      dom.listen(el, 'click', function(ev) {
        self.clickHandler(ev);
      });
    });
  },
  clickHandler: function(ev) {
    var el = ev.currentTarget,
        href = dom.getAttr(el, 'href');

    if (href) {
      ev.preventDefault();
      this.scroll(el, href);
    }
  },
  scroll: function(el, href) {
    var targetEl = this.findTarget(href),
        targetTop;

    targetTop = dom.offset(targetEl).top;
    this.animateScroll(targetTop, DURATION);
  },
  findTarget: function(href) {
    return dom.select(document, href);
  },
  min: function(a, b) {
    return a < b ? a : b;
  },
  animateScroll: function(end, duration) {
    var start = Date.now(),
      	body = document.documentElement.scrollTop?document.documentElement:document.body,
      	from = body.scrollTop,
        easingFunction = function (t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2 * t) * t; },
        self = this;

    if (from === end) {
      return;
    }

    var scroll = function() {
      var currentTime = Date.now(),
          time = self.min(1, ((currentTime - start) / duration)),
          easedT = easingFunction(time);

      body.scrollTop = (easedT * (end - from)) + from;

      if (time < 1) {
        dom.requestAnimationFrame(scroll);
      }
    };
    dom.requestAnimationFrame(scroll);
  }
};

module.exports = smooth;

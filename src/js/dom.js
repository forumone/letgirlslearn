'use strict';

var dom = {
  hide: function(el) {
    el.setAttribute('aria-hidden', true);
    el.style.display = 'none';
  },
  show: function(el) {
    el.setAttribute('aria-hidden', false);
    el.style.display = 'block';
  },
  visualShow: function(el, secs) {
    el.setAttribute('aria-hidden', true);
    el.style.opacity = 1.0;
    if (secs) {
      window.setTimeout(function() {
        el.style.zIndex = 100;
      }, secs * 1000);
    }
  },
  visualHide: function(el, secs) {
    el.setAttribute('aria-hidden', false);
    el.style.opacity = 0.0;
    if (secs) {
      window.setTimeout(function() {
        el.style.zIndex = -200;
      }, secs * 1000);
    }
  },
  addClass: function(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  },
  removeClass: function(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' +
            className.split(' ').join('|') +
            '(\\b|$)', 'gi'), ' ');
    }
  },
  loadScriptAsync: function(url, cb) {
    var script = document.createElement('script'),
        place = document.getElementsByTagName('script')[0];

    if (cb) { script.onload = cb; }
    script.src = ('https:' === document.location.protocol ?
      'https://' : 'http://') + url;
    script.type = 'text/javascript';
    script.async = 'true';
    place.parentNode.insertBefore(script, place);

  },
  offset: function(el) {
    var box = { top: 0, left: 0 };

    // BlackBerry 5, iOS 3 (original iPhone)
    if (typeof el.getBoundingClientRect !== undefined) {
      box = el.getBoundingClientRect();
    }

    return {
      top: box.top  + (window.pageYOffset || el.scrollTop)  - (el.clientTop  || 0),
      left: box.left + (window.pageXOffset || el.scrollLeft) - (el.clientLeft || 0)
    };
  },
  select: function(el, selector) {
    return el.querySelector(selector);
  },
  selectAll: function(el, selector) {
    return el.querySelectorAll(selector);
  },
  listen: function(el, eventType, handler) {
    return el.addEventListener(eventType, handler);
  },
  getAttr: function(el, attr) {
    return el.getAttribute(attr);
  },
  setAttr: function(el, attr, value) {
    return el.setAttribute(attr, value);
  }
};

// shim layer with setTimeout fallback
dom.requestAnimationFrame = (
  (window.requestAnimationFrame && window.requestAnimationFrame.bind(window))) ||
  (window.webkitRequestAnimationFrame && window.webkitRequestAnimationFrame.bind(window)) ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback){
      window.setTimeout(callback, 1000 / 60);
  };

module.exports = dom;

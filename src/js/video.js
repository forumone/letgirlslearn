'use strict';

var dom = require('./dom');

var TRANSITION_TIME = 1;

var video = {
  resetUI: function(video) {
    // TODO add a fade back in.
    var siblings = this.getSiblings(video);
    Array.prototype.forEach.call(siblings, function(sibling){
      dom.visualShow(sibling, TRANSITION_TIME);
    });
    dom.visualHide(video, TRANSITION_TIME);
    this.player.pauseVideo();
  },
  createElement: function() {
    var el = document.createElement('div'),
        wrap = document.createElement('div'),
        closeButton = document.createElement('a');

    el.id = 'singleVideo';

    dom.addClass(wrap, 'video');
    wrap.appendChild(el);

    dom.setAttr(closeButton, 'href', '#');
    dom.addClass(closeButton, 'button');
    dom.addClass(closeButton, 'button--close');
    dom.addClass(closeButton, 'js-closeVideo');
    wrap.appendChild(closeButton);

    return wrap;
  },
  createPlayer: function(videoId, youtubeCode) {
    var player,
        self = this;

    player = new window.YT.Player(videoId, {
      height: '390',
      width: '640',
      videoId: youtubeCode,
      playerVars: {
        autoplay: 1,
        rel: 0,
        controls: 0,
        autohide: 1,
        modestbranding: 1,
        showinfo: 0,
        html5: 1
      },
      events: { 'onStateChange': function(ev) {
        self.playerStateHandler(ev);
      }}
    });
    this.player = player;
    return player;
  },
  embed: function(youtubeCode, locationEl) {
    var video,
        player,
        siblings,
        closeButton,
        self = this;

    video = locationEl.querySelector('.video');
    // Don't append a video if it's already there.
    if (!video) {
      video = video = this.createElement();
      locationEl.insertBefore(video, locationEl.firstChild);
      player = this.createPlayer('singleVideo', youtubeCode);
      closeButton = dom.select(video, '.js-closeVideo');
      dom.listen(closeButton, 'click', function(ev) {
        ev.preventDefault();
        self.resetUI(video);
      });
    }
    siblings = this.getSiblings(video);
    Array.prototype.forEach.call(siblings, function(sibling){
      dom.visualHide(sibling, TRANSITION_TIME);
    });
    window.getComputedStyle(video).opacity;
    dom.visualShow(video, 0.1);

    window.setTimeout(function() {
      self.player && self.player.playVideo();
    }, TRANSITION_TIME * 1000);
  },
  getSiblings: function(el) {
    return Array.prototype.filter.call(el.parentNode.children, function(child){
      return child !== el;
    });
  },
  clickHandler: function(ev, youtubeCode, placeholderEl) {
    ev.preventDefault();
    this.embed(youtubeCode, placeholderEl);
  },
  playerStateHandler: function(ev) {
    // TODO add a timer to reset the UI after an amount of seconds where the
    // video has not been replayed.
    if (ev.data === 0) {
      this.resetUI(ev.target.d.parentNode);
    }
  },
  embedOnClick: function(youtubeCode, triggerEl, placeholderEl) {
    var self = this;
    this.youtubeCode = youtubeCode;
    this.triggerEl = triggerEl;
    this.placeholderEl = placeholderEl;
    triggerEl.addEventListener('click', function(ev) {
      self.clickHandler(ev, youtubeCode, placeholderEl);
    });
  }
};

module.exports = video;

'use strict';

var dom = require('./dom');
var video = require('./video');
var anchorScroll = require('./smooth_scrolling');
var toggle = require('./toggle');
var skrollr = require('skrollr');

var TOP_VIDEO_CODE = 'I9xtAgFZHtA',
    ANCHOR_SELECTOR = '.js-anchorLink',
    SHARE_SELECTOR = '.js-share',
    SUBSCRIBE_SELECTOR = '.js-subscribe',
    PANEL_SELECTOR = '.panel';

 /*jshint unused:false*/
function onYouTubeIframeAPIReady() {
  var videoPlayButton = document.querySelector('.jsVideoPlay'),
      videoId,
      videoPlaceholder;

  if (videoPlayButton) {
    videoId = videoPlayButton.getAttribute('data-video-id');
    videoPlaceholder = document.getElementById(videoId);
    video.embedOnClick(TOP_VIDEO_CODE, videoPlayButton, videoPlaceholder);
  }
}

function onReady() {
  var anchors = dom.selectAll(document, ANCHOR_SELECTOR),
      shareEl = dom.select(document, SHARE_SELECTOR),
      subscribeEl = dom.select(document, SUBSCRIBE_SELECTOR),
      panels = dom.selectAll(document, PANEL_SELECTOR),
      skrollrLocal;

  if (anchors.length) {
    anchorScroll.init(document, anchors);
  }
  if (shareEl) {
    toggle.init(shareEl,
      dom.select(shareEl, '.js-shareOn'),
      dom.select(shareEl, '.js-shareOff'));
  }
  if (subscribeEl) {
    toggle.init(subscribeEl,
      dom.select(subscribeEl, '.js-subscribeOn'),
      dom.select(subscribeEl, '.js-subscribeOff'));
  }
  if(!(/Android|iPhone|iPad|iPod|BlackBerry|MSIE 9.0|Windows Phone/i).test(
      navigator.userAgent || navigator.vendor || window.opera)) {
    skrollrLocal = skrollr.init({
      smoothScrolling: false,
      forceHeight: false
    });
    window._skrollr = skrollrLocal;
    // After refresh skrollr to recalculate positioning that get changes with
    // sticky nav (I think).
    setTimeout(function() {
      window._skrollr.refresh(panels);
    }, 500);
  }
}

document.addEventListener('DOMContentLoaded', onReady);

// Async scripts to load
dom.loadScriptAsync('www.youtube.com/iframe_api', onYouTubeIframeAPIReady);

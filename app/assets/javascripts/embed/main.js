/*


  Embedded Hermes Flow: 
    * page is being loaded
    * this javascript is loaded one way or the other

    1 - jquery checker
    2 - type of action (by checking hash, or by firing tour)
            /      \                             / 
    2a - Authoring  \                         /
      2b - General messaging               /
        2c - Tutorial/tour (can be multipage)

    2a => Authoring
    3 - enable mouse move
    4 - on user click, check css Path (new algorithm)
    5 - post message to window.opener containing the css path of the element that have been clicked

      2b => General messaging
      3 - automagically make a JSONP call to the server to obtain all the *general* messages of the website for that path
      4 - on JSONP callback, check sequentially the messages
      5 - check the type of the message
      5a - is it a tip?
           Can I show it? (cookie_check)
           show the tip via popover plugin. 
           On *got it* click, save state on the server
      5b - is it a broadcast?
           Can I show it (cookie_check)
           show the broadcast message
           On *close* click, save state on the server
    
        2c => Tutorial/tour (+ start automatically if no general messages)
        3 - on click (or if there're no general messages (? @TODO ask)), make a JSONP call to obtain the Tutorial, authoring tutorial)
        4 - on JSONP callback, start render the tour (w/ prev/next/close)
          4a - if next tip have different
        5 - on each step, save state on the server? (on the client should be ok)
        6 - on tour finish, save state on the server (same as general mess)
        
*/

!(function(w, ns){
  'use strict';

  var App = function() {
    this.version = '0.1';
    this.mode = ''; // authoring / preview / general-messaging / tutorial
    setTimeout(function(){
      new ns.JQueryChecker(function($){ this.init($) }.bind(this));
    }.bind(this), 100);
    return this;
  };

  App.prototype.initPubSub = function($) {
    // pubsub
    ns.subscriptions = {};

    ns.publish = function(topic, args) {
      ns.subscriptions[topic] && $.each(ns.subscriptions[topic], function() {
        this.apply(ns, args || []);
      });
    };

    ns.subscribe = function(topic, callback) {
      if (!ns.subscriptions[topic]) {
        ns.subscriptions[topic] = [];
      }
      ns.subscriptions[topic].push(callback);
      return [topic, callback];
    };

    ns.unsubscribe = function(handle) {
      var t;
      t = handle[0];
      ns.subscriptions[t] && $.each(ns.subscriptions[t], function(idx) {});
      if (this === handle[1]) {
        ns.subscriptions[t].splice(idx, 1);
      }
    };
  }

  App.prototype.init = function($){
    var hash = ns.hash, 
        path = ''
    ;
    this.initPubSub($);
    if ((hash.match(/^#hermes-authoring-tutorial/)) && (window.opener || ns.env === 'development')) {
      this.mode = 'authoring-tutorial';
      ns.init_authoring($);
    } else if ((hash.match(/^#hermes-authoring/)) && (window.opener || ns.env === 'development')) {
      this.mode = 'authoring';
      ns.init_authoring($);
    } else {
      ns.init_displayer($);
      ns.init_popover($);
      if (hash.match(/^#hermes-preview/)) {
        this.mode = 'preview';
        ns.init_preview($);
      } else {
        this.mode = 'general-messaging';
        ns.init_general_messaging($);
        // init also tutorials manager (TODO ask on general messaging over or not (selector problems, if on general messaging I click on the tutorial selector?))
        ns.subscribe('generalMessagingOver', function(){
          ns.init_tutorials_manager($);
        });
      }
    }

  };

  ns.App = App;

  ns.instances = {}
  ns.instances.app = new App;

})(this, __hermes_embed);
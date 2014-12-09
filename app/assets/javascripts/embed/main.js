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



  /**
  *
  * App class. Checks jQuery, checks mode through document.location.hash and init various
  * instances
  *
  **/

  var App = function() {
    this.version = '0.1';
    this.mode = ''; // authoring / preview / general-messaging / tutorial
    setTimeout(function(){
      new ns.JQueryChecker(function($){ this.init($) }.bind(this));
    }.bind(this), 100);
    return this;
  };



  /**
    * initPubSub 
    *
    * @param {$} function, the jQuery object noconflict
    *
    * @return {this} chainability
    *
    **/

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

    return this;
  }



  /**
    * createTutorialCookies 
    *
    * @param {tutorialId} Number, the id of the tutorial being saved on cookies
    * @param {tipIndex} Number, the index of the current tip
    *
    * @return {this} chainability
    *
    **/

  App.prototype.createTutorialCookies = function(tutorialId, tipIndex) {
    ns.cookie.create('hermes-tutorial-started', 'true');
    ns.cookie.create('hermes-tutorialid', tutorialId);
    ns.cookie.create('hermes-tipindex', tipIndex);
    return this;
  }



  /**
    * createTutorialCookies 
    *
    * @param {tutorialId} Number, the id of the tutorial being saved on cookies
    * @param {tipIndex} Number, the index of the current tip
    *
    * @return {this} chainability
    *
    **/

  App.prototype.deleteTutorialCookies = function() {
    ns.cookie.erase('hermes-tutorial-started');
    ns.cookie.erase('hermes-tutorialid');
    ns.cookie.erase('hermes-tipindex');
    return this;
  }



  /**
    * initSubscriptions 
    *
    * @return {this} chainability
    *
    **/

  App.prototype.initSubscriptions = function() {
    ns.subscribe('tutorialdeleted', function() {
      this.deleteTutorialCookies();
      this.mode = 'general-messaging';
      this.initMode();
    }.bind(this));

    ns.subscribe('generalMessagingOver', function(){
      this.mode = 'tutorial';
      ns.instances.tutorialmanager = new ns.TutorialsManager;
    }.bind(this));

    return this;
  }



  /**
    * initMode 
    *
    * @return {this} chainability
    *
    **/

  App.prototype.initMode = function() {
    switch(this.mode){
      case 'started-tutorial':
        new ns.Tutorial({}, {
          tutorialId : ns.cookie.read('hermes-tutorialid'),
          tipIndex   : ns.cookie.read('hermes-tipindex')
        });
        break;
      case 'authoring-tutorial':
      case 'authoring':
        ns.instances.authoring = new ns.Authoring;
        break;
      case 'preview':
      case 'general-messaging':
        if (this.mode === 'preview') {
          ns.instances.preview = new ns.Preview;
        } else {
          ns.instances.generalmessaging = new ns.GeneralMessaging;
        } 
        break;
    }
    return this;
  }



  /**
    * initClasses
    *
    * @param {$} function, the jQuery object noconflict 
    *
    * @return {this} chainability
    *
    **/


  App.prototype.initClasses = function($){
    ns.init_displayer($);
    ns.init_tutorial($);
    ns.init_tutorials_manager($);
    ns.init_popover($);
    ns.init_authoring($);
    ns.init_preview($);
    ns.init_general_messaging($);
    ns.instances.displayer = new ns.Displayer;
    ns.display = ns.instances.displayer.display.bind(ns.instances.displayer);
    return this;
  }



  /**
    * init
    *
    * @param {$} function, the jQuery object noconflict 
    *
    * @return {this} chainability
    *
    **/

  App.prototype.init = function($){
    var hash = ns.hash, 
        path = '',
        startedTutorial = ns.cookie.read('hermes-tutorial-started') !== null
    ;
    this.initPubSub($);
    this.initClasses($);
    if ((hash.match(/^#hermes-authoring-tutorial/)) && (window.opener || ns.env === 'development')) {
      this.mode = 'authoring-tutorial';
    } else if ((hash.match(/^#hermes-authoring/)) && (window.opener || ns.env === 'development')) {
      this.mode = 'authoring';
    } else {
      if (hash.match(/^#hermes-preview/)) {
        this.mode = 'preview';
      } else {
        if (startedTutorial) {
          this.mode = 'started-tutorial';
        } else{
          this.mode = 'general-messaging';
        }
      }
    }
    this.initSubscriptions();
    this.initMode();
    return this;
  };

  // create the instances object
  ns.instances = {};
  // create the app instance
  ns.instances.app = new App;

})(this, __hermes_embed);
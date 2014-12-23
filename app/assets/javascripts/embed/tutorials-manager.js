__hermes_embed.init_tutorials_manager = function($) {

  !(function(w, ns){

    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {
          retrieveTutorialsUrl: '/messages/tutorials.js?site_ref=' + ns.site_ref
        }
    ;

    var TutorialsManager = function(options) {
      this.version = '0.1';
      this.options = $.extend({}, DEFAULTS, options);
      this.init();
    };

    TutorialsManager.prototype.initSelectorTutorials = function() {
      this.selectorTutorialInit = true;
      this.selectorTutorials.forEach(function(selectorTutorial){
        ns.publish('loadTutorial', [selectorTutorial]);
      });
    }

    TutorialsManager.prototype.setTutorials = function(tutorials) {
      var len = 0;
      ns.init_tutorial($);
      ns.tutorials = ns.tutorials || {};
      this.availableTutorials = {};
      this.availableTutorials.already_viewed = tutorials.already_viewed.filter(function(tutorial){
        return tutorial.tips.length > 0;
      });
      this.availableTutorials.to_view = tutorials.to_view.filter(function(tutorial){
        return tutorial.tips.length > 0;
      });
      this.selectorTutorials = tutorials.with_selector.filter(function(tutorial){
        return tutorial.tips.length > 0;
      });
      len = this.selectorTutorials.length;
      while (len--) {
        currTutorial = this.selectorTutorials[len];
        if ($(currTutorial.selector).length === 0) {
          currTutorial.selector = '';
          this.autoStartTutorials.push(currTutorial);
          this.selectorTutorials.splice(len, 1);
        }
      };
      if (this.availableTutorials.already_viewed.length > 0 || this.availableTutorials.to_view.length > 0) {
        ns.display({type: 'availableTutorials', tutorials: this.availableTutorials});
      }
      if (this.selectorTutorials.length > 0) {
        this.initSelectorTutorials();
      }
    }

    TutorialsManager.prototype.init = function() {
      $.ajax(ns.host + this.options.retrieveTutorialsUrl, {
        dataType: 'jsonp',
        success: this.setTutorials.bind(this)
      });
    }

    ns.TutorialsManager = TutorialsManager;

  })(window, __hermes_embed);

};
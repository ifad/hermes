__hermes_embed.init_tutorials_manager = function($) {
  
  !(function(w, ns){
    
    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {
          retrieveTutorialsUrl: '/messages/tutorials.js'
        }
    ;

    var TutorialsManager = function(options) {
      this.version = '0.1';
      this.options = $.extend(DEFAULTS, options);
      this.init();
    };

    
    
    TutorialsManager.prototype.setTutorials = function(tutorials) {
      ns.init_tutorial($);
      ns.tutorials = {};
      // this.autoStartTutorials = tutorials.filter(function(tutorial){
      //   return tutorial.selector === null;
      // });
      // this.selectorTutorials = tutorials.filter(function(tutorial){
      //   return tutorial.selector !== null;
      // });
      tutorials.forEach(function(selectorTutorial){
        ns.tutorials['tutorial' + selectorTutorial.id] = new ns.Tutorial(selectorTutorial);
      });
    }

    TutorialsManager.prototype.init = function() {
      $.ajax(ns.host + this.options.retrieveTutorialsUrl, {
        dataType: 'jsonp',
        success: this.setTutorials.bind(this)
      });
    }

    ns.instances.tutorialsmanager = new TutorialsManager;

  })(window, __hermes_embed);

};
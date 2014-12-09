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

    TutorialsManager.prototype.initSelectorTutorials = function() {
      this.selectorTutorialInit = true;
      this.selectorTutorials.forEach(function(selectorTutorial){
        ns.tutorials['tutorial' + selectorTutorial.id] = new ns.Tutorial(selectorTutorial);
      });
    }

    TutorialsManager.prototype.enqueue = function() {
      this.queue = this.autoStartTutorials;
      this.dequeue();
    }

    TutorialsManager.prototype.dequeue = function() {
      if (this.queue.length === 0) {
        this.initSelectorTutorials();
        return;
      }
      new ns.Tutorial(this.queue.shift());
    }

    TutorialsManager.prototype.setTutorials = function(tutorials) {
      ns.init_tutorial($);
      ns.tutorials = {};
      this.autoStartTutorials = tutorials.filter(function(tutorial){
        return tutorial.tips.length > 0 && (tutorial.selector === null || tutorial.selector === '');
      });
      this.selectorTutorials = tutorials.filter(function(tutorial){
        return tutorial.tips.length > 0 && tutorial.selector !== null && tutorial.selector !== '';
      });
      this.enqueue();
    }

    TutorialsManager.prototype.init = function() {
      $.ajax(ns.host + this.options.retrieveTutorialsUrl, {
        dataType: 'jsonp',
        success: this.setTutorials.bind(this)
      });
      ns.subscribe('tutorialstarted', function(tutorial) {
        // flag the app w/ active tutorial (no other tutorials can be started while one is executing!)
        ns.activeTutorial = tutorial;
      });
      ns.subscribe('tutorialended', function() {
        // reset active tutorial
        ns.activeTutorial = null;
        !this.selectorTutorialInit && this.dequeue();
      }.bind(this));
    }

    ns.TutorialsManager = TutorialsManager;

  })(window, __hermes_embed);

};
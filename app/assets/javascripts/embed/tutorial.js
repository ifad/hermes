__hermes_embed.init_tutorial = function($) {

  !(function(w, ns){
    
    if (ns.Tutorial) {
      return;
    }

    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {
          retrieveTutorialUrl: '/messages/tutorials/{{tutorial_id}}.js'
        }
    ;

    var Tutorial = function(options, startedOptions) {
      this.version = '0.1';
      this.options = $.extend(DEFAULTS, options);
      if (startedOptions == null){
        this.init();
      } else {
        this.initStarted(startedOptions);
      }
      return this;
    };

    Tutorial.prototype.totalTips = function() {
      return this.tips.length;
    }

    Tutorial.prototype.isEnd = function() {
      return this.currentTipIndex === (this.tips.length - 1);
    }

    Tutorial.prototype.isBeginning = function() {
      return this.currentTipIndex === 0;
    }

    Tutorial.prototype.checkPathAndDisplay = function(tip) {
      if (w.location.pathname === tip.path) {
        ns.display(tip);
      } else {
        ns.instances.app.deleteTutorialCookies();
        ns.instances.app.createTutorialCookies(this.id, this.currentTipIndex);
        $(w).off('beforeunload');
        window.location.href = tip.path;
      }
    }

    Tutorial.prototype.next = function() {
      this.checkPathAndDisplay(this.tips[++this.currentTipIndex])
      return this;
    }

    Tutorial.prototype.prev = function() {
      this.checkPathAndDisplay(this.tips[--this.currentTipIndex]);
      return this;
    }

    Tutorial.prototype.end = function() {
      this.currentTipIndex = -1;
      this.started = false;
      ns.instances.app.deleteTutorialCookies();
      $(w).off('beforeunload');
      ns.publish('tutorialended', [this]);
      return this;
    }

    Tutorial.prototype.start = function() {
      if (this.started || ns.activeTutorial instanceof Tutorial) {
        return;
      }
      this.started = true;
      $(w).on('beforeunload', ns.utils.onBeforeUnloadTutorialFn);
      ns.publish('tutorialstarted', [this]);
      this.next();
      return this;
    }
    
    Tutorial.prototype.initStarted = function(startedOptions) {
      var url = this.options.retrieveTutorialUrl.replace('{{tutorial_id}}', startedOptions.tutorialId);
      $.ajax(ns.host + url, {
        dataType: 'jsonp',
        success: function(data) {
          if(data.length === 0) {
            ns.publish('tutorialdeleted');
          } else {
            this.options = $.extend(this.options, data[0]);
            this.init(startedOptions.tipIndex);
          }
        }.bind(this)
      });
    }

    Tutorial.prototype.init = function(tipIndex) {
      var startElement = null;
      this.id = this.options.id;
      this.currentTipIndex = tipIndex ? tipIndex-1 : -1;
      this.tips = this.options.tips;
      this.selector = this.options.selector;
      this.title = this.options.title;
      this.welcome = this.options.welcome;
      this.tips.forEach(function(tip){
        tip.tutorial_ref = this;
      }.bind(this));
      if (this.selector) {
        startElement = $(this.selector);
        startElement && startElement.on('click', function() {
          ns.utils.strip(this.welcome) === "" ? this.start() : ns.display({type: 'tutorialStarter', tutorial: this});
        }.bind(this));
        tipIndex && this.start();
      } else {
        tipIndex || ns.utils.strip(this.welcome) === "" ? this.start() : ns.display({type: 'tutorialStarter', tutorial: this});
      }
      return this;
    }

    ns.Tutorial = Tutorial;

  })(window, __hermes_embed);

};
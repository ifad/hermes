__hermes_embed.init_tutorial = function($) {
  
  !(function(w, ns){
    
    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {}
    ;

    var Tutorial = function(options) {
      this.version = '0.1';
      this.options = $.extend(DEFAULTS, options);
      this.init();
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

    Tutorial.prototype.next = function() {
      ns.display(this.tips[++this.currentTipIndex]);
    }

    Tutorial.prototype.prev = function() {
      ns.display(this.tips[--this.currentTipIndex]);
    }

    Tutorial.prototype.end = function() {
      this.currentTipIndex = -1;
      this.started = false;
    }

    Tutorial.prototype.start = function() {
      if (this.started)
        return;
      (this.started = true) && ns.publish('tutorialstarted');
      this.next();
    }
    
    Tutorial.prototype.init = function() {
      this.currentTipIndex = -1;
      this.tips = this.options.tips;
      this.selector = this.options.selector;
      var startElement = null;
      this.tips.forEach(function(tip){
        tip.tutorial_ref = this;
      }.bind(this));
      if(this.selector) {
        startElement = $(this.selector);
        startElement && startElement.on('click', this.start.bind(this));
      }
    }

    ns.Tutorial = Tutorial;

  })(window, __hermes_embed);

};
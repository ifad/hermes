__hermes_embed.Displayer = function($) {
  
  !(function(w, ns){
    
    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {}
    ;

    var Displayer = function(options) {
      this.version = '0.1';
      this.options = $.extend(DEFAULTS, options);
      this.init();
    };

    Displayer.prototype.showTip = function(tip, elem) {

      var content = $('<div class="hermes-content" />');
      content.html(tip.content);

      var buttonsContainer = $('<div class="hermes-actions" />');
      content.append(buttonsContainer);

      var close = $('<button class="hermes-close" />').html('Got it!');
      close.click(function (event) {
        elem.popover('destroy');
        // saveTipStateAndSnooze(tip, event);
      });
      buttonsContainer.append(close);

      elem.popover({
        html: true,
        placement: 'auto',
        trigger: 'manual',
        title: tip.title,
        content: content,
        container: 'body'
      });

      elem.popover('show');

    }

    Displayer.prototype.showBroadcast = function(message) {
      alert('broadcast')
    }

    Displayer.prototype.display = function(message) {
      switch(message.type) {
      case 'tutorial':
        break;

      case 'tip':
        var target = $(message.selector),
            pos = target.position()
        ;

        if (Math.abs(BODY.scrollTop() - pos.top) > ($(w).innerHeight() - 80)) {
          body.animate({scrollTop: pos.top - 80}, {
            duration: 300,
            complete: function() { this.showTip(message, target, true) }
          });
        } else {
          this.showTip(message, target);
        } 

        break;

      default:
        showBroadcast(message);
        break;
      }
    }

    Displayer.prototype.init = function() {
      
    }

    ns.instances.displayer = new Displayer;
    ns.display = ns.instances.displayer.display.bind(ns.instances.displayer);

  })(window, __hermes_embed);

};
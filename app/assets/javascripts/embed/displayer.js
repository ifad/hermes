__hermes_embed.init_displayer = function($) {
  
  !(function(w, ns){
    
    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {
          closeTipLabel: 'Got it!',
          bodyScrollDuration: 300, // ms
          topOffset: 200
        }
    ;

    var Displayer = function(options) {
      this.version = '0.1';
      this.options = $.extend(DEFAULTS, options);
      this.init();
    };

    Displayer.prototype.hideTip = function(elem, tip, evt) {
      elem.popover('destroy');
      ns.publish('tipHidden', [tip, evt])
    }

    Displayer.prototype.hideBroadcast = function(elem, message, evt) {
      elem.remove();
      ns.publish('broadcastHidden', [message, evt])
    }

    Displayer.prototype.displayTip = function(tip, elem) {

      var content = $('<div class="hermes-content" />'),
          buttonsContainer = $('<div class="hermes-actions" />'),
          close = $('<button class="hermes-close" />').html(this.options.closeTipLabel)
      ;

      close.click(function (event) {
        this.hideTip(elem, tip, event);
      }.bind(this));

      content.html(tip.content);
      content.append(buttonsContainer);
      buttonsContainer.append(close);

      elem
        .popover({
          html: true,
          placement: 'auto',
          trigger: 'manual',
          title: tip.title,
          content: content,
          container: 'body'
        })
        .popover('show');

    }

    Displayer.prototype.displayBroadcast = function(message) {
      var elem = $('<div class="hermes-broadcast" />'),
          close = $('<button class="hermes-close" />').html('&times;')
      ;

      close.click(function (event) {
        this.hideBroadcast(elem, message, event);
      }.bind(this));

      elem.append(message.content).append(close);

      $(document.body).prepend(elem);
    }

    Displayer.prototype.display = function(message) {
      switch(message.type) {
        case 'tip':
          var target = $(message.selector),
              pos = target.offset()
          ;
          if (Math.abs(BODY.scrollTop() - pos.top) > ($(w).innerHeight() - this.options.topOffset)) {
            BODY.animate({scrollTop: pos.top - this.options.topOffset}, {
              duration: this.options.bodyScrollDuration,
              complete: function() { 
                this.displayTip(message, target);
              }.bind(this)
            });
          } else {
            this.displayTip(message, target);
          } 
          break;
        default:
          this.displayBroadcast(message);
          break;
      }
    }

    Displayer.prototype.init = function() {
    }

    ns.instances.displayer = new Displayer;
    ns.display = ns.instances.displayer.display.bind(ns.instances.displayer);

  })(window, __hermes_embed);

};
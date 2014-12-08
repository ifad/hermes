__hermes_embed.init_displayer = function($) {
  
  !(function(w, ns){
    
    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {
          bodyScrollDuration: 300, // ms
          topOffset: 200
        },
        BROADCAST_TEMPLATE = 
          '<div class="hermes-broadcast">\
            <button class="hermes-close" type="button">&times;</button>\
          </div>',
        TIP_TEMPLATE = 
          '<div class="hermes-content">\
            <div class="hermes-actions">\
              <button class="hermes-close btn btn-primary" type="button">Got It!</button>\
            </div>\
          </div>',
        TUTORIAL_TIP_TEMPLATE = 
          '<div class="hermes-content">\
            <div class="hermes-actions">\
              <button class="hermes-prev btn btn-primary" type="button">prev</button>\
              <button class="hermes-next btn btn-primary" type="button">next</button>\
              <button class="hermes-end btn btn-primary" type="button">Got It!</button>\
            </div>\
          </div>'
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
      var content = $(TIP_TEMPLATE);
      content
        .prepend(tip.content)
        .on('click', '.hermes-close', function (event) {
          this.hideTip(elem, tip, event);
        }.bind(this));

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
      var content = $(BROADCAST_TEMPLATE);
      content
        .prepend(message.content)
        .on('click', '.hermes-close', function (event) {
          this.hideBroadcast(elem, message, event);
        }.bind(this));

      $(document.body).prepend(content);
    }

    Displayer.prototype.displayTutorialTip = function(tip, elem) {
      var content = $(TUTORIAL_TIP_TEMPLATE);
      content
        .find('.btn').hide().end()
        .prepend(tip.content)
        .on('click', '.hermes-next', function() {
          elem.popover('destroy');
          tip.tutorial_ref.next();
        })
        .on('click', '.hermes-prev', function() {
          elem.popover('destroy');
          tip.tutorial_ref.prev();
        })
        .on('click', '.hermes-end', function() {
          elem.popover('destroy');
          tip.tutorial_ref.end();
        })

      // show buttons by looking at tutorial (through tutorial_ref) status
      if (tip.tutorial_ref.isEnd()) {
        if (tip.tutorial_ref.totalTips() !== 1) {
          content.find('.hermes-prev, .hermes-end').show();
        } else {
          content.find('.hermes-end').show();
        }
      } else if (tip.tutorial_ref.isBeginning()) {
        content.find('.hermes-next').show();
      } else {
        content.find('.hermes-prev, .hermes-next').show();
      }

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

    Displayer.prototype.display = function(message) {
      switch(message.type) {
        case 'tip':
          var target = $(message.selector),
              pos = target.offset(),
              fired = false // double callback on html, body animate (to support multiple browsers!)
          ;
          if (Math.abs(BODY.scrollTop() - pos.top) > ($(w).innerHeight() - this.options.topOffset)) {
            $('html, body').animate({scrollTop: pos.top - this.options.topOffset},
              this.options.bodyScrollDuration,
              function() { 
                if (!fired) { // see above, after fired declaration
                  message.tutorial_ref ? this.displayTutorialTip(message, target) : this.displayTip(message, target);
                  fired = true;
                }
              }.bind(this)
            );
          } else {
            message.tutorial_ref ? this.displayTutorialTip(message, target) : this.displayTip(message, target);
          } 
          break;
        default:
          message.tutorial_ref ? this.displayTutorialBroadcast(message) : this.displayBroadcast(message);
          break;
      }
    }

    Displayer.prototype.init = function() {
    }

    ns.instances.displayer = new Displayer;
    ns.display = ns.instances.displayer.display.bind(ns.instances.displayer);

  })(window, __hermes_embed);

};
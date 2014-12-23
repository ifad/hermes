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
        TUTORIAL_BROADCAST_TEMPLATE =
          '<div class="hermes-broadcast">\
            <div class="hermes-actions">\
              <button class="hermes-prev btn btn-primary" type="button">prev</button>\
              <button class="hermes-next btn btn-primary" type="button">next</button>\
              <button class="hermes-end btn btn-primary" type="button">Got It!</button>\
            </div>\
          </div>',
        TUTORIAL_TIP_TEMPLATE =
          '<div class="hermes-content">\
            <div class="hermes-actions">\
              <button class="hermes-prev btn btn-primary" type="button">prev</button>\
              <button class="hermes-next btn btn-primary" type="button">next</button>\
              <button class="hermes-end btn btn-primary" type="button">Got It!</button>\
            </div>\
          </div>',
        TUTORIAL_STARTER_TEMPLATE =
          '<div class="hermes-tutorial-starter-overlay"></div>\
          <div class="hermes-tutorial-starter">\
            <div class="hermes-tutorial-starter-panel">\
              <div class="hermes-tutorial-starter-panel-content">\
                <span>There\'s a new tutorial <b>{{tutorial_title}}</b> available!</span>\
                <button class="hermes-start-tutorial btn btn-primary" type="button">Start it!</button>\
              </div>\
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
          this.hideBroadcast(content, message, event);
        }.bind(this));

      BODY.prepend(content);
    }

    Displayer.prototype.displayTutorialStarter = function(message) {
      var content = $(TUTORIAL_STARTER_TEMPLATE.replace('{{tutorial_title}}', message.tutorial.title));
      content.on('click', '.hermes-start-tutorial', function(event){
        content.remove();
        message.tutorial.start();
      });
      BODY.prepend(content);
    }

    Displayer.prototype.handleTutorialButtons = function(tip, content) {
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
    }

    Displayer.prototype.displayTutorialBroadcast = function(message) {
      var content = $(TUTORIAL_BROADCAST_TEMPLATE);
      content
        .find('.btn').hide().end()
        .prepend(message.content)
        .on('click', '.hermes-next', function() {
          content.remove()
          message.tutorial_ref.next();
        })
        .on('click', '.hermes-prev', function() {
          content.remove()
          message.tutorial_ref.prev();
        })
        .on('click', '.hermes-end', function() {
          content.remove()
          message.tutorial_ref.end();
        });
      this.handleTutorialButtons(message, content);
      BODY.prepend(content);
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
        });

      this.handleTutorialButtons(tip, content);

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
        case 'tutorialStarter':
          this.displayTutorialStarter(message);
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
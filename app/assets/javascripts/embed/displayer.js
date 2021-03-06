/*
  ---

  __hermes_embed.Displayer

  The Displayer class. 
  This class manages all the DOM manipulation and the html for the hermes embed.
  The core method is "display".

  (c) IFAD 2015
  @author: Stefano Ceschi Berrini <stefano.ceschib@gmail.com>
  @license: see LICENSE.md

  ---
*/


__hermes_embed.init_displayer = function($) {

  !(function(w, ns){

    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {
          bodyScrollDuration: 300, // ms
          topOffset: 100,
          overlayPadding: 3
        },

        // All the templates (maybe in the future they can be defined in a separate file or even better w/ haml and then compiled 
        //                    and imported like the cssloader)

        STATUS_MESSAGE =
          '<div class="hermes-status-message">\
            <div><img src="' + ns.assets.logo + '" width="20" height="20" alt="hermes" /> {{title}}</div>\
          </div>',
        BROADCAST_TEMPLATE =
          '<div class="hermes-broadcast">\
            <div class="hermes-broadcast-title"></div>\
            <div class="hermes-broadcast-content"></div>\
            <button class="js--hermes-close hermes-close" type="button">&times;</button>\
          </div>',
        TIP_TEMPLATE =
          '<div class="hermes-content">\
            <div class="hermes-actions">\
              <button class="js--hermes-close btn btn-primary btn-xs" type="button">Got It!</button>\
            </div>\
          </div>',
        TUTORIAL_BROADCAST_TEMPLATE =
          '<div class="hermes-broadcast">\
            <div class="hermes-broadcast-title"></div>\
            <div class="hermes-broadcast-content"></div>\
            <div class="hermes-actions">\
              <div class="hermes-more">\
                <span class="js--hermes-restart">restart</span>\
                <span class="js--hermes-exit">exit</span>\
              </div>\
              <div class="btn-group" role="group" aria-label="tutorial broadcast actions">\
                <button class="js--hermes-prev btn btn-primary btn-xs" type="button">prev</button>\
                <button class="js--hermes-next btn btn-primary btn-xs" type="button">next</button>\
                <button class="js--hermes-end btn btn-success btn-xs" type="button">Got It!</button>\
              </div>\
            </div>\
          </div>',
        TUTORIAL_TIP_TEMPLATE =
          '<div class="hermes-content">\
            <div class="hermes-actions">\
              <div class="hermes-more">\
                <span class="js--hermes-restart">restart</span>\
                <span class="js--hermes-exit">exit</span>\
              </div>\
              <div class="btn-group" role="group" aria-label="tutorial tip actions">\
                <button class="js--hermes-prev btn btn-primary btn-xs" type="button">prev</button>\
                <button class="js--hermes-next btn btn-primary btn-xs" type="button">next</button>\
                <button class="js--hermes-end btn btn-success btn-xs" type="button">Got It!</button>\
              </div>\
            </div>\
          </div>',
        TUTORIAL_STARTER_TEMPLATE =
          '<div class="hermes-tutorial-starter-overlay"></div>\
          <div class="hermes-tutorial-starter">\
            <div class="hermes-tutorial-starter-panel">\
              <div class="hermes-tutorial-starter-panel-content">\
                <span><b>{{title}}</b></span>\
                <p>{{welcome_message}}</p>\
                <button class="js--hermes-start-tutorial btn btn-primary" type="button">Start it!</button>\
                <button class="js--hermes-skip-tutorial btn btn-danger" type="button">Skip</button>\
              </div>\
            </div>\
          </div>',
        AVAILABLE_TUTORIALS_TEMPLATE =
          '<div class="hermes-available-tutorials">\
            <div>\
              <img src="' + ns.assets.logo + '" width="20" height="20" alt="hermes" />\
              <span class="hermes-available-tutorials-show-label">Show</span><span class="hermes-available-tutorials-hide-label">Hide</span> available tutorials \
            </div>\
            <ul class="hermes-available-tutorials-list"></ul>\
          </div>',
        AVAILABLE_TUTORIAL_TEMPLATE =
          '<li class="hermes-available-tutorial">\
            <button class="js--hermes-show-tutorial btn btn-primary btn-xs" type="button">start</button>\
            <span> {{title}} </span>\
          </li>',
        PROGRESS_BAR =
          '<div class="hermes-progress-bar">\
            <div class="hermes-progress-bar-indicator js--hermes-progress-indicator"></div>\
          </div>',
        OVERLAY =
          '<div class="hermes-overlay">\
            <div class="js--hermes-overlay-n hermes-overlay-section"></div>\
            <div class="js--hermes-overlay-s hermes-overlay-section"></div>\
            <div class="js--hermes-overlay-w hermes-overlay-section"></div>\
            <div class="js--hermes-overlay-e hermes-overlay-section"></div>\
          </div>'
    ;


    /**
      *
      * Displayer class
      *
      * ctor 
      *
      * @param options
      *
      * @return {this} chainability
      *
      **/

    var Displayer = function(options) {
      this.version = '0.1';
      this.options = $.extend({}, DEFAULTS, options);
      this.init();
      return this;
    };


    /**
      *
      * displayStatus
      *
      * show a message to the user about the status of the hermes embed
      *
      * @param {message} Object, the message that needs to be displayed via message.text
      *
      * @return nothing
      *
      **/

    Displayer.prototype.displayStatus = function(message) {
      var content = $(STATUS_MESSAGE.replace('{{title}}', message.text));
      BODY.append(content);
      setTimeout(function(){
        content.addClass('displayed');
      }, 200);
    }


    /**
      *
      * displayProgressBar
      *
      * show a progress bar during a tutorial
      *
      * @param {message} Object, the message that holds the tutorial reference
      *
      * @return nothing
      *
      **/

    Displayer.prototype.displayProgressBar = function(message) {
      var position = message.tutorial.getCurrentIndex()+1, // starts from 0
          tot = message.tutorial.getTotalTips(),
          content = null;
      if (!ns.DOM.progressBar) {
        content = $(PROGRESS_BAR);
        ns.DOM.progressBar = content;
        BODY.append(content);
      }
      ns.DOM.progressBar.show().find('.js--hermes-progress-indicator').css({
        width: ~~(position * 100 / tot) + "%"
      });
    }


    /**
      *
      * displayElementOverlay
      *
      * show an overlay for the element (tip/broadcast of a tutorial)
      *
      * @param {elem} DOM node, the element that is being displayed
      *
      * @return nothing
      *
      **/

    Displayer.prototype.displayElementOverlay = function(elem) {
      var elemOffset = elem.offset(),
          size = {
            x: elem.outerWidth(),
            y: elem.outerHeight()
          },
          position = {
            x: elemOffset.left,
            y: elemOffset.top
          },
          bottomTop = position.y + size.y,
          o = this.options
      ;

      ns.DOM.overlays.n.show().css({
        top: 0,
        height: position.y - o.overlayPadding,
        width: '100%'
      });
      ns.DOM.overlays.s.show().css({
        height: DOC.height() - bottomTop - o.overlayPadding,
        top: bottomTop + o.overlayPadding,
        width: '100%'
      });
      ns.DOM.overlays.w.show().css({
        height: size.y + (o.overlayPadding * 2),
        top: position.y - o.overlayPadding,
        width: position.x - o.overlayPadding,
        left: 0
      });
      ns.DOM.overlays.e.show().css({
        height: size.y + (o.overlayPadding * 2),
        top: position.y - o.overlayPadding,
        width: BODY.width() - position.x - size.x - o.overlayPadding,
        right: 0
      });
    }


    /**
      *
      * displayOverlay
      *
      * set the overlay for the elements
      *
      * @param {elem} DOM node, the element that is being displayed
      *
      * @return nothing
      *
      **/

    Displayer.prototype.displayOverlay = function(elem) {
      var content = null;
      if (!ns.DOM.overlay) {
        content = $(OVERLAY);
        ns.DOM.overlay = content;
        ns.DOM.overlays = {
          n: ns.DOM.overlay.find('.js--hermes-overlay-n'),
          s: ns.DOM.overlay.find('.js--hermes-overlay-s'),
          e: ns.DOM.overlay.find('.js--hermes-overlay-e'),
          w: ns.DOM.overlay.find('.js--hermes-overlay-w')
        }
        BODY.append(content);
      }
      BODY.addClass('hermes--is-overflow-hidden');
      ns.DOM.overlay.show();
      this.displayElementOverlay(elem);
    }


    /**
      *
      * hideTip
      *
      * hide the current tip
      *
      * @param {elem} DOM node, the element that is being displayed
      * @param {tip} the current tip
      * @param {evt} Event
      *
      * @return nothing
      *
      **/

    Displayer.prototype.hideTip = function(elem, tip, evt) {
      elem.popover('destroy');
      elem.off('.popover').removeData('bs.popover');
      $('.popover').remove();
      ns.publish('tipHidden', [tip, evt])
    }


    /**
      *
      * hideBroadcast
      *
      * hide the current broadcast
      *
      * @param {elem} DOM node, the element that is being displayed
      * @param {message} the current broadcast
      * @param {evt} Event
      *
      * @return nothing
      *
      **/

    Displayer.prototype.hideBroadcast = function(elem, message, evt) {
      elem.remove();
      ns.publish('broadcastHidden', [message, evt])
    }


    /**
      *
      * displayTip
      *
      * display the current tip
      *
      * @param {tip} Object, the current tip
      * @param {elem} DOM node associated to the tip via tip.selector
      *
      * @return nothing
      *
      **/

    Displayer.prototype.displayTip = function(tip, elem) {
      var content = $(TIP_TEMPLATE),
          container = ns.utils.checkFixedElement(elem, $);
      content
        .prepend(tip.content)
        .on('click', '.js--hermes-close', function (event) {
          if (container !== 'body') {
            container.removeClass('hermes-force-element-z-index')
          }
          this.hideTip(elem, tip, event);
        }.bind(this));

      elem
        .popover({
          html: true,
          placement: 'auto',
          trigger: 'manual',
          title: tip.title,
          content: content,
          container: ns.utils.checkFixedElement(elem, $)
        })
        .popover('show');

      if (container !== 'body') {
        container.addClass('hermes-force-element-z-index')
      }

    }


    /**
      *
      * displayBroadcast
      *
      * display the current broadcast
      *
      * @param {message} Object, the current broadcast
      *
      * @return nothing
      *
      **/

    Displayer.prototype.displayBroadcast = function(message) {
      var content = $(BROADCAST_TEMPLATE);
      content
        .find('.hermes-broadcast-title').append(message.title).end()
        .find('.hermes-broadcast-content').append(message.content).end()
        .on('click', '.js--hermes-close', function (event) {
          this.hideBroadcast(content, message, event);
        }.bind(this));

      BODY.append(content);
    }


    /**
      *
      * handleTutorialButtons
      *
      * for each tutorial tip/broadcast, buttons are different for the 1st and the last tutorial
      * first doesn't have 'prev', last doesn't have 'next'
      *
      * @param {tip} Object, the current tip
      * @param {content} The jQuery DOM element associated to the tip
      *
      * @return nothing
      *
      **/
      
    Displayer.prototype.handleTutorialButtons = function(tip, content) {
      // show buttons by looking at tutorial (through tutorial_ref) status
      if (tip.tutorial_ref.isEnd()) {
        if (tip.tutorial_ref.getTotalTips() !== 1) {
          content.find('.js--hermes-prev, .js--hermes-end').show();
          content.find('.js--hermes-next, .js--hermes-exit').remove();
        } else {
          content.find('.js--hermes-end').show();
          content.find('.js--hermes-prev, .js--hermes-next, .js--hermes-exit').remove();
        }
      } else if (tip.tutorial_ref.isBeginning()) {
        content.find('.js--hermes-next').show();
        content.find('.js--hermes-prev, .js--hermes-end, .js--hermes-restart').remove();
      } else {
        content.find('.js--hermes-prev, .js--hermes-next').show();
        content.find('.js--hermes-end').remove();
      }
    }

    /**
      *
      * displayTutorialBroadcast
      *
      * display the current tutorial broadcast
      *
      * @param {message} Object, the current broadcast
      *
      * @return nothing
      *
      **/

    Displayer.prototype.displayTutorialBroadcast = function(message) {
      var content = $(TUTORIAL_BROADCAST_TEMPLATE);
      content
        .find('.btn').hide().end()
        .find('.hermes-broadcast-title').append(message.title).end()
        .find('.hermes-broadcast-content').append(message.content).end()
        .on('click', '.js--hermes-next', function() {
          content.remove();
          message.tutorial_ref.next();
        })
        .on('click', '.js--hermes-prev', function() {
          content.remove();
          message.tutorial_ref.prev();
        })
        .on('click', '.js--hermes-restart', function() {
          content.remove();
          message.tutorial_ref.restart();
        })
        .on('click', '.js--hermes-exit', function() {
          content.remove();
          message.tutorial_ref.end(true);
        })
        .on('click', '.js--hermes-end', function() {
          content.remove();
          message.tutorial_ref.end();
        });
      this.handleTutorialButtons(message, content);
      BODY.append(content);
      this.currentObject = {element: content, tip: message, content: content, type: 'broadcast'};
      message.tutorial_ref.options.overlay && this.displayOverlay(content);
    }


    /**
      *
      * displayTutorialTip
      *
      * display the current tutorial tip
      *
      * @param {tip} Object, the current tip
      * @param {elem} DOM node, the element associated to the tip via tip.selector
      *
      * @return nothing
      *
      **/

    Displayer.prototype.displayTutorialTip = function(tip, elem) {
      var content = $(TUTORIAL_TIP_TEMPLATE),
          container = ns.utils.checkFixedElement(elem, $),
          removePopover = function(){
            elem.popover('destroy');
            elem.off('.popover').removeData('bs.popover');
            $('.popover').remove();
            if (container !== 'body') {
              container.removeClass('hermes-force-element-z-index')
            }
          };
      content
        .find('.btn').hide().end()
        .prepend(tip.content)
        .on('click', '.js--hermes-next', function() {
          removePopover();
          tip.tutorial_ref.next();
        })
        .on('click', '.js--hermes-prev', function() {
          removePopover();
          tip.tutorial_ref.prev();
        })
        .on('click', '.js--hermes-restart', function() {
          removePopover();
          tip.tutorial_ref.restart();
        })
        .on('click', '.js--hermes-exit', function() {
          removePopover();
          tip.tutorial_ref.end(true);
        })
        .on('click', '.js--hermes-end', function() {
          removePopover();
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
          container: container
        })
        .popover('show');

      if (container !== 'body') {
        container.addClass('hermes-force-element-z-index')
      }

      this.currentObject = {element: elem, tip: tip, content: content, type: 'tip'};
      tip.tutorial_ref.options.overlay && this.displayOverlay(elem);
    }


    /**
      *
      * displayTutorialStarter
      *
      * display the tutorial starter if tutorial has a welcome message
      *
      * @param {message} Object, that holds the tutorial reference
      *
      * @return nothing
      *
      **/

    Displayer.prototype.displayTutorialStarter = function(message) {
      var contentStr = TUTORIAL_STARTER_TEMPLATE.replace('{{welcome_message}}', message.tutorial.welcome).replace('{{title}}', message.tutorial.title)
          content = $(contentStr)
      ;
      content
        .on('click', '.js--hermes-start-tutorial', function(event){
          content.remove();
          BODY.removeClass('hermes--is-overflow-hidden');
          message.tutorial.start();
        })
        .on('click', '.js--hermes-skip-tutorial', function() {
          content.remove();
          BODY.removeClass('hermes--is-overflow-hidden');
          message.tutorial.end(true); // end w/ skip parameter (don't update state db)
        });

      BODY.append(content).addClass('hermes--is-overflow-hidden');

      ns.publish('hideAvailableTutorials');
    }


    /**
      *
      * displayAvailableTutorials
      *
      * display the list of available tutorials (showing viewed tutorials and the *new* tutorials)
      *
      * @param {message} Object, that holds all the tutorials of the page
      *
      * @return nothing
      *
      **/

    Displayer.prototype.displayAvailableTutorials = function(message) {
      var content = $(AVAILABLE_TUTORIALS_TEMPLATE),
          tutorialsDOM = [];
      content.on('click', '> div', function() {
        content.toggleClass('open');
      });

      if (message.tutorials.to_view.length > 0) {
        content.find(' > div').append($('<span class="label label-success"><span>' + message.tutorials.to_view.length + '</span> new</span>'))
      }

      message.tutorials.to_view.forEach(function(tutorial, index){
        var li = $(AVAILABLE_TUTORIAL_TEMPLATE.replace('{{title}}', " " + tutorial.title));
        tutorial.to_view = true;
        li.attr('id', 'hermes-tutorial-starter-' + tutorial.id);
        li.data('ref-tot-tutorials', content.find('.label-success > span'))
        li.on('click', '.js--hermes-show-tutorial', function() {
          ns.publish('loadTutorial', [tutorial]);
        });
        li.find(' > span').prepend($('<span class="label label-success"><b>new</b></span>'))
        tutorialsDOM.push(li);
      });

      message.tutorials.already_viewed.forEach(function(tutorial, index){
        var li = $(AVAILABLE_TUTORIAL_TEMPLATE.replace('{{title}}', tutorial.title));
        li.on('click', '.js--hermes-show-tutorial', function() {
          ns.publish('loadTutorial', [tutorial]);
        });
        li.find(' > span').append($('<span><b>(' + ns.labels.alreadyViewed + ')</b></span>'))
        tutorialsDOM.push(li);
      });

      content.find('ul').append(tutorialsDOM);
      BODY.append(content);
      setTimeout(function(){
        content.addClass('displayed');
      }, 200);
      ns.DOM.availableTutorialsDisplayer = content;
    }


    /**
      *
      * display
      *
      * Given a message, decide what to display based on the type of the message
      *
      * @param {message} Object, that holds the information to be displayed
      *
      * @return nothing
      *
      **/

    Displayer.prototype.display = function(message) {
      switch(message.type) {
        case 'tip':
          var target = $(message.selector).first(),
              pos = target.offset(),
              fired = false // double callback on html, body animate (to support multiple browsers!)
                            // could've used a closure, but it's more readable in this way.
          ;
          if (!ns.utils.isElementInViewport(target[0])) {
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
        case 'availableTutorials':
          this.displayAvailableTutorials(message);
          break;
        case 'progressBar':
          this.displayProgressBar(message);
          break;
        case 'authoring':
          this.displayStatus(message);
          break;
        case 'preview':
          this.displayStatus(message);
          break;
        default:
          message.tutorial_ref ? this.displayTutorialBroadcast(message) : this.displayBroadcast(message);
          break;
      }
    }


    /**
      *
      * recalculate (<FUTURE DEV>)
      *
      * When the window is resized, we should recalculate the overlay + the tip position
      *
      * @return nothing
      *
      **/

    // Displayer.prototype.recalculate = function() {
    //   var obj = this.currentObject;
    //   if (obj) {
    //     if(obj.type === 'broadcast') {
    //       obj.tip.tutorial_ref.options.overlay && this.displayOverlay(obj.content);
    //     } else {
    //       if (obj.element.is(':visible')) {
    //         obj.tip.tutorial_ref.options.overlay && this.displayOverlay(obj.element);
    //         obj.element.popover('show');
    //       } else {
    //         ns.DOM.overlay.hide();
    //       }
    //     }
    //   }
    // }


    /**
      *
      * init
      *
      * @return nothing
      *
      **/

    Displayer.prototype.init = function() {
      // <FUTURE DEV>
      // $(w).on('resize', ns.utils.throttle(this.recalculate.bind(this), 100));
    }


    // export it
    ns.Displayer = Displayer;

  })(window, __hermes_embed);

};
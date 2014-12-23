__hermes_embed.init_general_messaging = function($) {

  !(function(w, ns){

    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {
          snoozeTimeOut: 250, //ms
          retrieveMessagesUrl: '/messages.js?site_ref=' + ns.site_ref
        }
    ;

    var GeneralMessaging = function(options) {
      this.version = '0.1';
      this.options = $.extend({}, DEFAULTS, options);
      this.queue = [];
      this.init();
    };

    GeneralMessaging.prototype.saveTipStateAndSnooze = function(tip, evt) {
      evt.preventDefault();
      evt.stopPropagation();
      evt.stopImmediatePropagation();

      $(w).trigger('hermes.dismiss-message');

      $.ajax(tip.url, {
        dataType: 'jsonp',
        complete: function(jqXHR, status) { /* Nothing, for now */ }
      });
    }

    GeneralMessaging.prototype.enqueue = function(messages) {
      this.queue = messages;
      this.dequeue();
    }

    GeneralMessaging.prototype.dequeue = function() {
      var currentTip = null,
          tipElement = null;
      if (this.queue.length === 0) {
        ns.publish('generalMessagingOver', []);
        return;
      }
      currentTip = this.queue.shift();
      if (currentTip.type === 'tip') {
        tipElement = $(currentTip.selector);
        if (tipElement.length === 0 || !tipElement.is(':visible')) {
          this.dequeue();
          return;
        }
      }
      ns.display(currentTip);

      $(w).one('hermes.dismiss-message', function () {
        setTimeout(this.dequeue.bind(this), this.options.snoozeTimeOut);
      }.bind(this));
    }

    GeneralMessaging.prototype.init = function() {
      $.ajax(ns.host + this.options.retrieveMessagesUrl, {
        dataType: 'jsonp',
        success: this.enqueue.bind(this)
      });
      ns.subscribe('tipHidden', function(tip, evt){
        this.saveTipStateAndSnooze(tip, evt);
      }.bind(this));
      ns.subscribe('broadcastHidden', function(broadcast, evt){
        this.saveTipStateAndSnooze(broadcast, evt);
      }.bind(this));
    }

    ns.GeneralMessaging = GeneralMessaging;

  })(window, __hermes_embed);

};
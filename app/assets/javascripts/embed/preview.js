__hermes_embed.init_preview = function($) {

  !(function(w, ns){

    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {}
    ;


    /**
    *
    * Preview class
    *
    **/

    var Preview = function(options) {
      this.version = '0.1';
      this.options = $.extend({}, DEFAULTS, options);
      this.init();
    };



    /**
      * init
      *
      * @return {this} chainability
      *
      **/

    Preview.prototype.init = function() {
      ns.display({type: 'preview', text: 'Hermes preview mode'});
      w.addEventListener('message', function(evt) {
        $.ajax(ns.host + evt.data, {
          dataType: 'jsonp',
          success: function(message) {
            if(message.type === 'tip') {
              var elem = $(message.selector);
              if(elem.length === 0 || !elem.is(':visible')) {
                alert(ns.labels.elementNoMorePresent);
                w.close();
                return;
              }
            }
            ns.display(message);
          }
        });
      });
      w.opener.postMessage('__get__tip__path', ns.host);
      ns.subscribe('tipHidden', function() {
        w.close();
      });
      ns.subscribe('broadcastHidden', function() {
        w.close();
      });
      return this;
    }


    // export it to be used externally
    ns.Preview = Preview;

  })(window, __hermes_embed);

};
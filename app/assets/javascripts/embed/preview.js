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
      w.addEventListener('message', function(evt) {
        $.ajax(ns.host + evt.data, {
          dataType: 'jsonp',
          success: ns.display
        });
      });
      w.opener.postMessage('__get__tip__path', ns.protocol + ':' + ns.host);
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
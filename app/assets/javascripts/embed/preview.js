__hermes_embed.init_preview = function($) {
  
  !(function(w, ns){
    
    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {}
    ;

    var Preview = function(options) {
      this.version = '0.1';
      this.options = $.extend(DEFAULTS, options);
      this.init();
    };
    
    Preview.prototype.init = function() {
      this.path = ns.hash.match(/#hermes-preview,([\w\/]+)/)[1];
      $.ajax(ns.host + this.path, {
        dataType: 'jsonp',
        success: ns.display
      });
    }

    ns.instances.preview = new Preview;

  })(window, __hermes_embed);

};
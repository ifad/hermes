__hermes_embed.Preview = function($) {
  
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

    Preview.prototype.display = function(message) {
      ns.display(message);
    }

    Preview.prototype.init = function() {
      this.path = document.location.hash.match(/#hermes-preview,([\w\/]+)/)[1];
      $.ajax(ns.host + this.path, {
        dataType: 'jsonp',
        success: this.display.bind(this)
      });
    }

    ns.instances.preview = new Preview;

  })(window, __hermes_embed);

};
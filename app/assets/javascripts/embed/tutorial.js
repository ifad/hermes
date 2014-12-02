__hermes_embed.init_tutorial = function($) {
  
  !(function(w, ns){
    
    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {}
    ;

    var Tutorial = function(options) {
      this.version = '0.1';
      this.options = $.extend(DEFAULTS, options);
      this.init();
    };
    
    Tutorial.prototype.init = function() {
    }

    ns.instances.generalmessaging = new Tutorial;

  })(window, __hermes_embed);

};
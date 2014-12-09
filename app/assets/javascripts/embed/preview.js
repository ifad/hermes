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
      this.options = $.extend(DEFAULTS, options);
      this.init();
    };



    /**
      * init 
      *
      * @return {this} chainability
      *
      **/
    
    Preview.prototype.init = function() {
      this.path = ns.hash.match(/#hermes-preview,([\w\/]+)/)[1];
      $.ajax(ns.host + this.path, {
        dataType: 'jsonp',
        success: ns.display
      });
      return this;
    }


    // export it to be used externally
    ns.Preview = Preview;

  })(window, __hermes_embed);

};
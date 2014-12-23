!(function(w, ns, d){
  'use strict';

  var JQUERYURL = '//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js';

  var JQueryChecker = function(callback) {
    this.version = '0.1';
    this.onLoadedCallback = callback;
    this.init();
  }

  JQueryChecker.prototype.loadScript = function(url, handler) {
    var script = d.createElement('script'),
        firstScriptOfPage = d.scripts[0],
        _this = this
    ;
    script.src = url;
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
          typeof handler == 'function' && handler.call(_this);
        }
      }
    } else {
      script.onload = handler.bind(_this);
    }
    firstScriptOfPage.parentNode.insertBefore(script,firstScriptOfPage);
  }

  JQueryChecker.prototype.init = function() {
    if (w.jQuery === undefined ||
        w.jQuery.fn.jquery === undefined ||
        w.jQuery.fn.jquery.split === undefined) {
      this.loadScript(JQUERYURL, this.loadHandler);
    } else {
      var ver = w.jQuery.fn.jquery.split('.'),
          maj = parseInt(ver[0]),
          min = parseInt(ver[1])
      ;
      if (maj > 1 || (maj == 1 && min > 8)) {
        this.onLoadedCallback(w.jQuery);
      } else {
        this.loadScript(JQUERYURL, this.loadHandler);
      }
    }
  }

  JQueryChecker.prototype.loadHandler = function() {
    jQuery = w.jQuery.noConflict(true);
    this.onLoadedCallback(jQuery);
  }

  ns.JQueryChecker = JQueryChecker;

})(this, __hermes_embed, document);
/*
  ---

  __hermes_embed.JQueryChecker

  The JQueryChecker class.
  If there's already jQuery loaded (and version is > than 1.8), we'll use that $, otherwise we'll load jQuery dynamically.

  (c) IFAD 2015
  @author: Stefano Ceschi Berrini <stefano.ceschib@gmail.com>
  @license: see LICENSE.md

  ---
*/

!(function(w, ns, d){
  'use strict';

  var JQUERYURL = '//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js';


  /**
    *
    * JQueryChecker class
    * ctor
    * @param {callback} Function, the callback to call once the right jQuery is available
    *
    * @return nothing
    *
    **/

  var JQueryChecker = function(callback) {
    this.version = '0.1';
    this.onLoadedCallback = callback;
    this.init();
  }


  /**
    *
    * loadScript
    *
    * load jQuery script and call the handler fn
    *
    * @param {url} String, the url where to retrieve jQuery
    * @param {handler} Function, the handler to associate once the script is loaded
    *
    * @return nothing
    *
    **/

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

  /**
   *
   * duplicatejQuery
   *
   * Duplicates the given jQuery object and returns a new one.
   *
   * @return jQuery
   *
   **/
  JQueryChecker.prototype.duplicatejQuery = function(original) {
    // Set up the jQuery API interface
    var duplicate = function(selector, context) {
      return new duplicate.fn.init(selector, context);
    };

    // Add all methods
    original.extend(true, duplicate, original);

    // Update the init prototype to use the duplicate fn, so that
    // jQuery collections will have Hermes' fn and not the window
    // one.
    duplicate.fn.init.prototype = duplicate.fn;

    // Set up a custom identifier
    duplicate.expando = 'jQueryForHermesTheEpicMessengerService';

    // Profit
    return duplicate;
  }


  /**
    *
    * init
    *
    * check if $ is defined and its version and in case load the newer jQuery
    *
    * @return nothing
    *
    **/

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
        var jQuery = this.duplicatejQuery(w.jQuery)
        this.onLoadedCallback(jQuery);
      } else {
        this.loadScript(JQUERYURL, this.loadHandler);
      }
    }
  }

  /**
    *
    * loadHandler
    *
    * the method to call when jQuery is ready. It will call the provided callback w/ the right jQuery noconflicted
    *
    * @return nothing
    *
    **/

  JQueryChecker.prototype.loadHandler = function() {
    this.onLoadedCallback(w.jQuery.noConflict(true));
  }


  // export it
  ns.JQueryChecker = JQueryChecker;

})(this, __hermes_embed, document);

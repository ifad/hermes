/*

Copyright (c) <2014> <IFAD>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---

Fire the JS!

*/

!(function($, ns){
  'use strict';

  String.prototype.toViewTitle = String.prototype.toViewTitle || function() {
    var n = this.split('-'),
        len = n.length,
        i = 0,
        l = '',
        r = '',
        accumulator = ''
    ;
    l = n[0].charAt(0).toUpperCase() + n[0].slice(1);
    accumulator = l;
    for(; i < len; i ++) {
      l = n[i].charAt(0).toUpperCase() + n[i].slice(1);
      r = n[i+1] ? n[i+1].charAt(0).toUpperCase() + n[i+1].slice(1) : '';
      accumulator += r;
    }
    return accumulator;
  };

  var App = function() {
    this.version = '0.1';
    this.components = {};
    this.init();
  };

  App.prototype._startBootstrap = function() {
    $("a[rel~=popover], .has-popover").popover();
    $("a[rel~=tooltip], .has-tooltip").tooltip();
    $('.datetimepicker').datetimepicker({ language: 'en-US' });

    // WYSIWYG Editor
    // $('.wysihtml5').each(function() {
    //   $(this).wysihtml5({
    //     'font-styles': true, //Font styling, e.g. h1, h2, etc. Default true
    //     'emphasis'   : true,  // Italics, bold, etc. Default true
    //     'lists'      : false, // (Un)ordered lists, e.g. Bullets, Numbers. Default true
    //     'html'       : false, // Button which allows you to edit the generated HTML. Default false
    //     'link'       : true,  // Button to insert a link. Default true
    //     'image'      : false, // Button to insert an image. Default true,
    //     'color'      : true   // Button to change color of font
    //   });
    // });
  }

  App.prototype._findAndInstantiateViews = function() {
    $('[data-view]:not([data-instantiated=true])').each(function(i, el){
      var viewName = $(el).data('view').toViewTitle();
      $(el).attr('data-instantiated', true);
      this.components[viewName] = new ns[viewName]();
    }.bind(this))
  }

  App.prototype.init = function() {
    this._startBootstrap();
    this._findAndInstantiateViews();
  };

  ns.App = new App();

})(jQuery, HERMES);
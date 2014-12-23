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

*/

!(function($, ns, w){
  'use strict';

  var b = $(document.body);


  /**
  *
  * TipEdit object constructor. It handles the tip edit form.
  *
  * @return {this} (current instance, chaining purpose)
  *
  **/

  var TipCollection = function(element) {
    this.version = '0.1';
    this.element = element || b;
    this.init();
    return this;
  };

  TipCollection.prototype.destroyTip = function(id) {
    this.element.find('[data-tip-id=' + id + ']').remove();
    if (this.element.find('.entity').length === 0) {
      this.element.find('.hero-unit').removeClass('hide');
      this.element.find('.tip-collection-top').addClass('hide');
      this.element.find('.hero-unit').addClass('animated bounceIn');
    }
  }

  TipCollection.prototype._receiveMessage = function(evt) {
    if (evt.data === '__get__mode__') {
      this.openedWindow.postMessage('preview', this.openedWindowHref);
    } else if (evt.data === '__get__tip__path') {
      this.openedWindow.postMessage(this.currentTarget.data('messagepath'), this.openedWindowHref);
    }
    return this;
  }

  TipCollection.prototype.openExternalLink = function(evt) {
    evt.preventDefault();
    var $target = $(evt.target);
    $target = $target.is('a') ? $target : $target.parent('a');
    this.currentTarget = $target;
    this.openedWindow = w.open($target.attr('href'));
    this.openedWindowHref = $target.attr('href');
  }

  TipCollection.prototype.init = function() {
    this.element.find('.tips-container').sortable({
      revert: true,
      start: function(event, ui) {
        ui.item.removeClass('animated fadeIn');
      },
      update: function(event, ui) {
        var pos = $('.tips-container').find('.entity').index(ui.item);
        $.ajax("/tips/" + ui.item.attr('data-tip-id') + '/position', {
          data: { pos: pos },
          type: 'put',
          success: function() {
          }
        });
      }
    });
    this.element.find('.tips-container').disableSelection();
    this.element.on('click', 'a.ext', this.openExternalLink.bind(this));
    w.addEventListener('message', this._receiveMessage.bind(this), false);
    return this;
  };

  // export it via provided namespace

  ns.TipCollection = TipCollection;

})(jQuery, HERMES, this);
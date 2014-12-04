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

  var TipEdit = function(element) {
    this.version = '0.1';
    this.element = element || b;
    this.init();
    return this;
  };


  TipEdit.prototype.submitForm = function(evt) {
    this.element.find('#tip_content').val(this.contentEditor.serialize()['element-0'].value);
  }

  /**
  * Init method, called when the object is being created via the constructor function.
  *
  * @return {this} (current instance, chaining purpose)
  **/

  TipEdit.prototype.init = function() {
    this.element.externalconnector();
    this.contentEditor = new MediumEditor('.textarea-editable', {
      buttons: ['bold', 'italic', 'underline', 'anchor', 'orderedlist', 'unorderedlist'],
      targetBlank: true,
      disableDoubleReturn: true
    });
    console.log(this.contentEditor)
    this.element.on('submit', 'form', this.submitForm.bind(this))
    return this;
  };

  // export it via provided namespace

  ns.TipEdit = TipEdit;

})(jQuery, HERMES, this);
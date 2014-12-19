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
  * EntityEdit object constructor. It handles the tip edit form.
  *
  * @return {this} (current instance, chaining purpose)
  *
  **/

  var EntityEdit = function(element) {
    this.version = '0.1';
    this.element = element || b;
    this.init();
    return this;
  };


  EntityEdit.prototype.submitForm = function(evt) {
    this.element.find('.textarea-target').val(this.contentEditor.serialize()['element-0'].value);
  }

  EntityEdit.prototype.selectPath = function(evt) {
    var path = $(evt.target).parents('.input-group').find('input:text'),
        pathV = path.val()
    ;
    path.focus().get(0).setSelectionRange(pathV.length,pathV.length);
  }

  /**
  * Init method, called when the object is being created via the constructor function.
  *
  * @return {this} (current instance, chaining purpose)
  **/

  EntityEdit.prototype.init = function() {
    this.element.find('input:text').first().focus();
    this.element.externalconnector();
    this.contentEditor = new MediumEditor('.textarea-editable', {
      buttons: ['bold', 'italic', 'underline', 'anchor', 'orderedlist', 'unorderedlist'],
      targetBlank: true
    });
    this.element.on('submit', 'form', this.submitForm.bind(this));
    this.element.on('click', '.input-group-addon-text', this.selectPath.bind(this));
    return this;
  };

  // export it via provided namespace

  ns.EntityEdit = EntityEdit;

})(jQuery, HERMES, this);
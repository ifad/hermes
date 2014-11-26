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

This almigthy file implements the connection between Hermes and the target
site during Tip authoring. It opens up the target site in a pop-up window,
so 90's, with a specific URL fragment to enable the authoring component in
hermes.js, that works much like WebKit's and FireBug inspectors.

Then, after selecting and clicking onto an element, its CSS selector is
calculated (roughly) and it is passed back onto the window.opener to be
then stored in Hermes' DB.

*/

!(function($, ns, w){

  var b = $(document.body);


  /**
  *
  * TipConnector object constructor. It handles the tip edit form.
  *
  * @return this (current instance, chaining purpose)
  *
  **/

  var TipConnector = function() {
    this.version = '0.1';
    this.components = {
      tipPath         : $('#tip-path'),
      tipBroadcast    : $('#tip-broadcast'),
      tipConnect      : $('#tip-connect'),
      tipConnectLink  : $('#tip-connect-link')
    };
    this.init();
    return this;
  };




  /**
  * On broadcast radio selection, it will reset the selector and hide the 
  * connected label element
  *
  * @param event, a valid DOM event
  *
  * @return this (current instance, chaining purpose)
  **/
  

  TipConnector.prototype._setBroadcast = function(evt) {
    var $broadcast = this.components.tipBroadcast,
        $output     = $($broadcast.data('output'))
    ;

    if (!$broadcast.is(':checked'))
      return;

    $output.find('input').val('')
    $output.addClass('hide');

    return this;
  }




  /**
  * Whenever the path is changed, just update the connection link
  * it also checks wether the value is invalid (like empty string or string
  * is not starting with '/')
  *
  * @param event, a valid DOM event
  *
  * @return this (current instance, chaining purpose)
  **/

  TipConnector.prototype._changePath = function(evt) {
    var $input  = this.components.tipPath,
        $target = $($input.data('tip-connect-path')),
        val = $input.val().trim(),
        val = val === '' ? '/' : val.split('')[0] !== '/' ? '/' + val : val,
        url = [
          $target.data('hostname'),
          val,
          '', $target.data('token'),
        ].join('')
    ;
    $input.val(val);
    $target.attr('href', url);

    return this;
  }




  /**
  * This method handles the message received from the popup window (through 
  * window.opener.postMessage. This is window.opener because we call it via window.open)
  *
  * @param event, a valid DOM event
  *
  * @return this (current instance, chaining purpose)
  **/

  TipConnector.prototype._receiveMessage = function(evt) {
    this.$output.find('input').val(evt.data);
    this.$output.removeClass('hide');

    return this;
  }




  /**
  * When I click on the bound item radio, it will call the correct link by opening a
  * popup. This is needed to be able to obtain a communication between the opened window
  * and this window
  *
  * @param event, a valid DOM event
  *
  * @return this (current instance, chaining purpose)
  **/

  TipConnector.prototype._connect = function(evt) {
    evt.preventDefault();

    var $connector = this.components.tipConnectLink;
    this.$output = this.$output || $($connector.data('output'));

    w.open($connector.attr('href'));

    return this;
  }




  /**
  * Init method, called when the object is being created via the constructor function.
  * Delegating events for the edit tip form
  *
  * @return this (current instance, chaining purpose)
  **/

  TipConnector.prototype.init = function() {
    b.on('click', '#tip-connect-label', this._connect.bind(this));
    b.on('change', '#tip-broadcast', this._setBroadcast.bind(this));
    b.on('blur', '#tip-path', this._changePath.bind(this));
    w.addEventListener('message', this._receiveMessage.bind(this), false);
    return this;
  };

  // export it via provided namespace

  ns.TipConnector = TipConnector;

})(jQuery, HERMES, this);
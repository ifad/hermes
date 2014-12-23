/* ========================================================================
  jQuery External Connector
 * ======================================================================== */


!function (w, $) {
  'use strict';

  // ExternalConnector CLASS DEFINITION
  // ======================

  var ExternalConnector = function (el) {
    this.version = '0.1';
    this.$el = $(el);
    this.components = {
      path           : this.$el.find('.ext-path'),
      removeSelector : this.$el.find('.ext-remove-selector'),
      connect        : this.$el.find('.ext-connect'),
      connectLink    : this.$el.find('#ext-connect-link')
    };
    this.init();
    return this;
  }


  /**
  * On broadcast radio selection, it will reset the selector and hide the
  * connected label element
  *
  * @param {event}, a valid DOM event
  *
  * @return {this} (current instance, chaining purpose)
  **/


  ExternalConnector.prototype._removeSelector = function(evt) {
    var $noSelector = this.components.removeSelector,
        $output     = $($noSelector.data('output'))
    ;

    if (!$noSelector.is(':checked'))
      return;

    $output.find('input').val('');
    $output.addClass('hide');

    return this;
  }

  ExternalConnector.prototype._toggleAbsolutePath = function(evt) {
    if (!$(evt.target).is(':checked'))
      this.components.connectLink.attr('data-hostname', this.defaultHost);
      this._changePath();
  }

  ExternalConnector.prototype._changeAbsolutePath = function(evt) {
    var val = $(evt.target).find(':selected').val().trim();
    if (val) {
      this.components.connectLink.attr('data-hostname', 'http://' + val);
      this._changePath();
    } else {
      this.components.connectLink.attr('data-hostname', this.defaultHost);
      this._changePath();
    }
  }

  /**
  * Whenever the path is changed, just update the connection link
  * it also checks wether the value is invalid (like empty string or string
  * is not starting with '/')
  *
  * @param {event}, a valid DOM event
  *
  * @return {this} (current instance, chaining purpose)
  **/

  ExternalConnector.prototype._changePath = function() {
    var $input  = this.components.path,
        $target = $($input.data('connect-path')),
        val = $input.val().replace(/\s/g, ''),
        val = val === '' ? '/' : val.split('')[0] !== '/' ? '/' + val : val,
        url = [
          $target.attr('data-hostname'),
          val
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
  * @param {event}, a valid DOM event
  *
  * @return {this} (current instance, chaining purpose)
  **/

  ExternalConnector.prototype._receiveMessage = function(evt) {
    if (evt.data === '__get__mode__') {
      this.openedWindow.postMessage(this.openedMode, this.openedWindowHref);
    } else {
      this.$output.find('input').val(evt.data);
      this.$output.removeClass('hide');
    }
    return this;
  }

  /**
  * When I click on the bound item radio, it will call the correct link by opening a
  * popup. This is needed to be able to obtain a communication between the opened window
  * and this window
  *
  * @param {event}, a valid DOM event
  *
  * @return {this} (current instance, chaining purpose)
  **/

  ExternalConnector.prototype._connect = function(evt) {
    evt.preventDefault();

    w.removeEventListener('message', this._receiveMessage.bind(this));
    w.addEventListener('message', this._receiveMessage.bind(this), false);

    var $connector = this.components.connectLink;
    this.$output = this.$output || $($connector.data('output'));

    this.openedWindow = w.open($connector.attr('href'));
    this.openedMode = $connector.data('token');
    this.openedWindowHref = $connector.attr('href');

    return this;
  }


  ExternalConnector.prototype.init = function() {
    this.defaultHost = this.components.connectLink.attr('data-hostname');
    this.$el
      .on('click', '.ext-connect', this._connect.bind(this))
      .on('change', '.ext-remove-selector', this._removeSelector.bind(this))
      .on('blur', '.ext-path', this._changePath.bind(this))
      .on('change', '.input-addon-abs-path select', this._changeAbsolutePath.bind(this))
      .on('change', '#absolute_url', this._toggleAbsolutePath.bind(this))
    ;
  }

  // ExternalConnector PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data  = $this.data('hermes.externalconnector');
      if (!data) $this.data('hermes.externalconnector', (data = new ExternalConnector(this)));
    })
  }

  var old = $.fn.externalconnector

  $.fn.externalconnector             = Plugin
  $.fn.externalconnector.Constructor = ExternalConnector


  // ExternalConnector NO CONFLICT
  // =================

  $.fn.externalconnector.noConflict = function () {
    $.fn.externalconnector = old;
    return this;
  }

}(this, jQuery);
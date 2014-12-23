__hermes_embed.init_authoring = function($) {

  !(function(w, ns){

    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {
          thickness: 2,
          overlayStyle : {
            margin: 0,
            padding: 0,
            position: 'absolute',
            'background-color': 'rgb(65, 161, 255)',
            cursor: 'pointer',
            'z-index': '1000000',
            'box-shadow': '0 0 3px rgba(0, 0, 0, 0.2)'
          },
          elementStyle : {
            'background-color': 'rgba(33, 143, 255, 0.5)',
            'background-image': 'none',
            cursor: 'pointer'
          }
        }
    ;

    var Authoring = function(options) {
      this.version = '0.1';
      this.options = $.extend({}, DEFAULTS, options);
      this.init();
    };

    Authoring.prototype.prepareOverlay = function() {
      this.overlay = {
        N: $('<div/>', {id: 'hermes_overlayN', class: 'hermes-overlay'}).css(this.options.overlayStyle),
        S: $('<div/>', {id: 'hermes_overlayS', class: 'hermes-overlay'}).css(this.options.overlayStyle),
        E: $('<div/>', {id: 'hermes_overlayE', class: 'hermes-overlay'}).css(this.options.overlayStyle),
        W: $('<div/>', {id: 'hermes_overlayW', class: 'hermes-overlay'}).css(this.options.overlayStyle)
      };
      for (i in this.overlay) {
        this.overlay[i].bind('click.hermes', this.callback.bind(this));
        BODY.append(this.overlay[i]);
      }
    }

    Authoring.prototype.buildOverlay = function(element) {
      var rect = element.getBoundingClientRect(),
          scrollTop = DOC.scrollTop(),
          scrollLeft = DOC.scrollLeft(),
          t = this.options.thickness
      ;
      // North
      //
      this.overlay.N.css({
        width:  rect.width,
        height: t,
        top:    (rect.top - t/2) + scrollTop,
        left:   (rect.left) + scrollLeft
      });

      // South
      //
      this.overlay.S.css({
        width:  rect.width,
        height: t,
        top:    (rect.top + rect.height - t/2) + scrollTop,
        left:   (rect.left) + scrollLeft
      });

      // East
      //
      this.overlay.E.css({
        width:  t,
        height: rect.height + t,
        top:    (rect.top  - t/2) + scrollTop,
        left:   (rect.left + rect.width - t) + scrollLeft
      });

      // West
      //
      this.overlay.W.css({
        width:  t,
        height: rect.height + t,
        top:    (rect.top  - t/2) + scrollTop,
        left:   (rect.left - t/2) + scrollLeft
      });
    }

    Authoring.prototype.mouseover = function(evt) {
      try {
        var element = evt.target,
            $element = $(element);
        if (element.tagName === 'BODY'
            || element === this.selectedElement
            || $element.hasClass('hermes-overlay')
            || $element.hasClass('hermes-status-message')
            || $element.parents('.hermes-status-message').length > 0)
          return;

        this.buildOverlay(element);

        // Reset the old selected element
        //
        if (this.selectedElement && $.contains(document, this.selectedElement)) {
          this.selectedElement = $(this.selectedElement);
          this.selectedElement
            .css(this.selectedElement.data('hermes-restore-css'))
            .data('hermes-restore-css', null)
            .unbind('click.hermes', this.callback.bind(this));
        }
        this.selectedElement = element;
        // Set the onclick handler to our callback
        //
        $(this.selectedElement).data('hermes-restore-css', {
          'cursor': this.selectedElement.style.cursor,
          'background-color': this.selectedElement.style.backgroundColor,
          'background-image': this.selectedElement.style.backgroundImage,
        }).css(this.options.elementStyle).bind('click.hermes', this.callback.bind(this));

      } catch (e) {
        console.log(e);
      }
    }

    Authoring.prototype.callback = function(evt) {
      var path = '',
          $selected = $(this.selectedElement)
      ;
      evt.preventDefault();
      evt.stopPropagation();
      evt.stopImmediatePropagation();

      if (ns.instances.app.mode === 'authoring-tutorial') {
        if ($selected.is('a')
          || $selected.parents('a').length > 0
          || $selected.is('button:submit')
          || $selected.parents('button:submit').length > 0) {

          alert(ns.labels.alertBindTutorial);
          return;
        }
      }

      if(ns.utils.checkFixedElement($selected, $) !== 'body' && !confirm(ns.labels.elementPositionFixedWarning)) {
        return;
      }

      path = ns.utils.getCSSPath(this.selectedElement);

      if (w.opener) {
        w.opener.postMessage(path, ns.host);
        w.close();
      } else {
        console.log('no opener specified\npath:', path);
      }
      return {path: path, element: this.selectedElement};
    }

    Authoring.prototype.init = function() {
      ns.display({type: 'authoring', text: 'Hermes authoring mode'});
      this.prepareOverlay();
      this.selectedElement = null;
      DOC.on('mouseover', ns.utils.throttle(this.mouseover.bind(this), 100));
    }

    ns.Authoring = Authoring;

  })(window, __hermes_embed);

};
// this.author = function (opener_protocol) {
//       // Cache the document here for speed.
//       var doc = $(document);

//       // This is the selected element, that gets updated while hovering
//       var selected = null;

//       // This is the way out, that sends the selected element Selector out to
//       // the opener window.
//       var callback = function (event) {
//         event.preventDefault();
//         event.stopPropagation();
//         event.stopImmediatePropagation();
//         var path = __hermes_embed.utils.getCSSPath(selected);
//         window.opener.postMessage(path, opener_protocol + ':' + __hermes_embed.host);
//         window.close();
//       };


//       // Create the 4 overlays that make up the border of the hovering element.
//       //
//       var css = {
//         margin: 0, padding: 0, position: 'absolute',
//         'background-color': '#a00', cursor: 'pointer'
//       };
//       var overlay = {
//         N: $('<div/>', {id: 'overlayN'}).css(css),
//         S: $('<div/>', {id: 'overlayS'}).css(css),
//         E: $('<div/>', {id: 'overlayE'}).css(css),
//         W: $('<div/>', {id: 'overlayW'}).css(css),
//       };

//       for (i in overlay) {
//         overlay[i].bind('click.hermes', callback);
//         $('html').append(overlay[i]);
//       }

//       var thickness = 5; // px

//       // And now set the mousemove event handler
//       $('body').on('mousemove', function (event) {
//         try {

//           var elem = event.toElement;

//           if (elem.tagName == 'BODY')
//             return;

//           if (elem == selected)
//             return;

//           // Build the wrapping rectangle
//           //
//           var rect = elem.getBoundingClientRect();
//           var stop = doc.scrollTop(), sleft = doc.scrollLeft();

//           // North
//           //
//           overlay.N.css({
//             width:  rect.width,
//             height: thickness,
//             top:    (rect.top - thickness/2) + stop,
//             left:   (rect.left) + sleft
//           });

//           // South
//           //
//           overlay.S.css({
//             width:  rect.width,
//             height: thickness,
//             top:    (rect.top + rect.height - thickness/2) + stop,
//             left:   (rect.left) + sleft
//           });

//           // East
//           //
//           overlay.E.css({
//             width:  thickness,
//             height: rect.height + thickness,
//             top:    (rect.top  - thickness/2) + stop,
//             left:   (rect.left + rect.width - thickness/2) + sleft
//           });

//           // West
//           //
//           overlay.W.css({
//             width:  thickness,
//             height: rect.height + thickness,
//             top:    (rect.top  - thickness/2) + stop,
//             left:   (rect.left - thickness/2) + sleft
//           });

//           // Reset the old selected element
//           //
//           if (selected) {
//             selected = $(selected);
//             selected.css(selected.data('hermes-restore-css')).
//               data('hermes-restore-css', null).
//               unbind('click.hermes', callback);
//           }
//           selected = elem;

//           // Set the onclick handler to our callback
//           //
//           $(selected).data('hermes-restore-css', {
//             'cursor': selected.style.cursor,
//             'background-color': selected.style.backgroundColor
//           }).css({
//             'cursor': 'pointer',
//             'background-color': '#ddd'
//           }).bind('click.hermes', callback);

//         } catch (e) {
//           console.log(e);
//         }
//       });
//     }

//     return this;
//   }


__hermes_embed.Authoring = function($) {
  
  !(function(w, ns){
  
    var Authoring = function() {
      this.version = '0.1';
      this.init();
    }

    Authoring.prototype.callback = function() {
      
    }

    Authoring.prototype.init = function() {

    }

    ns.instances.authoring = new Authoring;

  })(this, __hermes_embed);

};
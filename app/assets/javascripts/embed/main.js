/*


  Embedded Hermes Flow: 
    * page is being loaded
    * this javascript is loaded one way or the other

    1 - jquery checker
    2 - type of action (by checking hash, or by firing tour)
            /      \                             / 
    2a - Authoring  \                         /
      2b - General messaging               /
        2c - Tutorial/tour (can be multipage)

    2a => Authoring
    3 - enable mouse move
    4 - on user click, check css Path (new algorithm)
    5 - post message to window.opener containing the css path of the element that have been clicked

      2b => General messaging
      3 - automagically make a JSONP call to the server to obtain all the *general* messages of the website for that path
      4 - on JSONP callback, check sequentially the messages
      5 - check the type of the message
      5a - is it a tip?
           Can I show it? (cookie_check)
           show the tip via popover plugin. 
           On *got it* click, save state on the server
      5b - is it a broadcast?
           Can I show it (cookie_check)
           show the broadcast message
           On *close* click, save state on the server
    
        2c => Tutorial/tour (+ start automatically if no general messages)
        3 - on click (or if there're no general messages (? @TODO ask)), make a JSONP call to obtain the Tutorial, authoring tutorial)
        4 - on JSONP callback, start render the tour (w/ prev/next/close)
          4a - if next tip have different
        5 - on each step, save state on the server? (on the client should be ok)
        6 - on tour finish, save state on the server (same as general mess)
        
*/

!(function(w, ns){
  'use strict';

  var App = function() {
    this.version = '0.1';
    new ns.JQueryChecker(function($){ this.init($) }.bind(this));
  };

  App.prototype.init = function($){
    var hash = document.location.hash, 
        path = ''
    ;
    if ((hash.match(/^#hermes-authoring/)) && (window.opener || ns.env === 'development')) {
      ns.Authoring($);
    } else {
      ns.Displayer($);
      ns.init_popover($);
      if (hash.match(/^#hermes-preview/)) {
        ns.Preview($);  
      } else {
        console.log('display');    
      }
    }

  };

  ns.App = App;

  ns.instances = {}
  ns.instances.app = new App;

})(this, __hermes_embed);



// (function() {

//   function main() {
//     jQuery(document).ready(function($) {
//       var h = new Hermes($);

//       if ((m = document.location.hash.match(/^#hermes-authoring,(https?)/)) && window.opener) {
//         h.author(m[1]); // XXX DIRTY

//       } else if ((m = document.location.hash.match(/#hermes-preview,([\w\/]+)/))) {
//         h.preview(m[1]);

//       } else {
//         h.display();
//       }
//     });
//   }

//   function Hermes($) {
//     this.display = function() {
//       __hermes_embed.init_popover($);
      
//       $.ajax(__hermes_embed.host + '/messages.js', {
//         dataType: 'jsonp',
//         success: enqueue.bind(this)
//       });
//     }

//     this.preview = function (path) {
//       __hermes_embed.init_popover($);

//       $.ajax(__hermes_embed.host + path, {
//         dataType: 'jsonp',
//         success: show
//       });
//     }

//     var enqueue = function(messages) {
//       this.queue = messages;
//       dequeue.apply(this);
//     };

//     var dequeue = function() {
//       if (this.queue.length == 0) return;
//       show(this.queue.shift());

//       $(window).one('hermes.dismiss-message', function () {
//         setTimeout(dequeue.bind(this), 250);
//       }.bind(this));
//     }

//     var show = function(message) {
//       alert(message.type);
//       switch(message.type) {
//       case 'tutorial':
//         break;

//       case 'tip':
//         var target = $(message.selector);
//         pos = target.position();

//         var body = $(document.body);
//         if (Math.abs(body.scrollTop() - pos.top) > ($(window).innerHeight() - 80))
//           body.animate({scrollTop: pos.top - 80}, {
//             duration: 300,
//             complete: function() { showTip(message, target, true) }
//           });

//         else
//           showTip(message, target);

//         break;

//       default:
//         showBroadcast(message);
//         break;
//       }
//     }

//     var showTutorial = function(tutorial) {
//       console.log(tutorial); // XXX
//     }

//     var showTip = function(tip, elem) {
//       var content = $('<div class="hermes-content" />');
//       content.html(tip.content);

//       var buttonsContainer = $('<div class="hermes-actions" />');
//       content.append(buttonsContainer);

//       var close = $('<button class="hermes-close" />').html('Got it!');
//       close.click(function (event) {
//         elem.popover('destroy');
//         saveTipStateAndSnooze(tip, event);
//       });
//       buttonsContainer.append(close);

//       elem.popover({
//         html: true,
//         placement: 'auto',
//         trigger: 'manual',
//         title: tip.title,
//         content: content,
//         container: 'body'
//       });

//       elem.popover('show');
//     }

//     var showBroadcast = function(broadcast) {
//       var elem = $('<div class="hermes-broadcast" />');

//       var close = $('<button class="hermes-close" />').html('&times;');
//       close.click(function (event) {
//         elem.remove();
//         saveTipStateAndSnooze(broadcast, event)
//       });

//       elem.append(broadcast.content).append(close);

//       $(document.body).prepend(elem);
//     }

//     var saveTipStateAndSnooze = function(tip, event) {
//       event.preventDefault();
//       event.stopPropagation();
//       event.stopImmediatePropagation();

//       $(window).trigger('hermes.dismiss-message');

//       $.ajax(tip.url, {
//         dataType: 'jsonp',
//         complete: function(jqXHR, status) { /* Nothing, for now */ }
//       });
//     };

// })();
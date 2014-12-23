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

Various utils
  + Path finder. Given a node, find the css path

*/

// prototypes utilities

Array.prototype.keySet = function() {};

Node.prototype.nodeNameInCorrectCase = function(){
   return this.nodeName.toLowerCase();
}





!(function(w, ns) {
  'use strict';

  /**
  *
  * Utils object. It stores css path helpers + other utils
  *
  **/

  var utils = {


    /**
    * throttle
    *
    * @param {fn} function, the function being throttled
    * @param {time} int, ms throttling time
    *
    * @return {Function} the throttled function
    *
    **/

    throttle: function(fn, time) {
      var timeout = null,
          time = time || 200,
          last = null;
      return function() {
        var now = +new Date(), _t = this, args = arguments;
        if (last && now < last + time) {
          clearTimeout(timeout);
          timeout = setTimeout(function() {
            fn.apply(_t, args);
          }, time);
        } else {
          last = now;
          fn.apply(this, arguments);
        }
      }
    },


    /**
    * validNode
    *
    * @param {node}
    * @return {Boolean} if it's a valid node element
    *
    **/

    validNode: function(node) {
      return node.nodeType === Node.ELEMENT_NODE
    },


    /**
    *
    * getCSSPath
    * given a DOM node, it constructs the css path TOP DOWN
    *
    * @param {node} a valid DOM node
    * @param {optimized} experimental. To return an optimized path
    * @return {string} (the css path of the element)
    *
    * Part of this function (and its dependent functions) are subject to the following licence (taken from webkit/blink devtools)
    *
    /*
     * Copyright (C) 2011 Google Inc.  All rights reserved.
     * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
     * Copyright (C) 2008 Matt Lilek <webkit@mattlilek.com>
     * Copyright (C) 2009 Joseph Pecoraro
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions
     * are met:
     *
     * 1.  Redistributions of source code must retain the above copyright
     *     notice, this list of conditions and the following disclaimer.
     * 2.  Redistributions in binary form must reproduce the above copyright
     *     notice, this list of conditions and the following disclaimer in the
     *     documentation and/or other materials provided with the distribution.
     * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
     *     its contributors may be used to endorse or promote products derived
     *     from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
     * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    */

    getCSSPath: function(node, optimized){
      if (!this.validNode(node))
        return "";

      var steps = [];
      var contextNode = node;
      while (contextNode) { // from node to root
          // check the css path
          var step = this.cssPathStep(contextNode, !!optimized, contextNode === node);
          if (!step)
            break;
          steps.push(step);
          if (step.optimized)
            break;
          contextNode = contextNode.parentNode;
      }

      steps.reverse();
      return steps.join(" > ");

    },


    /**
     * @param {string} c
     */

    toHexByte: function(c) {
      var hexByte = c.charCodeAt(0).toString(16);
      if (hexByte.length === 1)
        hexByte = "0" + hexByte;
      return hexByte;
    },




    /**
     * @param {string} c
     * @param {boolean} isLast
     * @return {string}
     */

    escapeAsciiChar: function(c, isLast) {
      return "\\" + this.toHexByte(c) + (isLast ? "" : " ");
    },




    /**
     * @param {string} c
     * @return {boolean}
     */

    isCSSIdentChar: function(c) {
      if (/[a-zA-Z0-9_-]/.test(c))
        return true;
      return c.charCodeAt(0) >= 0xA0;
    },




    /**
     * @param {string} value
     * @return {boolean}
     */

    isCSSIdentifier: function(value){
      return /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value);
    },




    /**
    * @param {string} ident
    * @return {string}
    **/

    escapeIdentifierIfNeeded: function(ident) {
      if (this.isCSSIdentifier(ident))
          return ident;
      var shouldEscapeFirst = /^(?:[0-9]|-[0-9-]?)/.test(ident);
      var lastIndex = ident.length - 1;
      return ident.replace(/./g, function(c, i) {
          return ((shouldEscapeFirst && i === 0) || !this.isCSSIdentChar(c)) ? this.escapeAsciiChar(c, i === lastIndex) : c;
      });
    },




    /**
    * idSelector
    *
    * @param {string} id
    * @return {string}
    *
    **/

    idSelector: function(id) {
      return "#" + this.escapeIdentifierIfNeeded(id);
    },




    /**
    * prefixedElementClassNames
    *
    * @param {node} id
    * @return {array}
    *
    **/

    prefixedElementClassNames: function(node) {
      var classAttribute = node.getAttribute("class");
      if (!classAttribute)
        return [];
      return classAttribute.split(/\s+/g).filter(Boolean).map(function(name) {
          // The prefix is required to store "__proto__" in a object-based map.
          return "$" + name;
      });
    },




    /**
    * DOMNodePathStep
    *
    * @param {value}
    * @param {optimized}
    *
    **/

    DOMNodePathStep: function(value, optimized) {
      this.value = value;
      this.optimized = optimized || false;
    },




    /**
    * cssPathStep
    *
    * @param {node}
    * @param {optimized}
    * @param {isTargetNode}
    *
    **/

    cssPathStep: function(node, optimized, isTargetNode) {

      if (!this.validNode(node))
        return null;

      // get the node id
      var id = node.getAttribute("id"),
          nodeName = node.nodeNameInCorrectCase(),
          parent = node.parentNode;

      if (optimized) {
        if (id) {
          return new this.DOMNodePathStep(this.idSelector(id), true);
        }
        if (nodeName === "body" || nodeName === "head" || nodeName === "html") {
          return new this.DOMNodePathStep(nodeName, true);
        }
      }

      if (id) {
        return new this.DOMNodePathStep(nodeName + this.idSelector(id), true);
      }

      if (!parent || parent.nodeType === Node.DOCUMENT_NODE) {
        return new this.DOMNodePathStep(nodeName, true);
      }

      var prefixedOwnClassNamesArray = this.prefixedElementClassNames(node),
          needsClassNames = false,
          needsNthChild = false,
          ownIndex = -1,
          elementIndex = -1,
          siblings = parent.children,
          siblingsL = siblings.length
      ;
      for (var i = 0; (ownIndex === -1 || !needsNthChild) && i < siblingsL; ++i) {
          var sibling = siblings[i];
          if (!this.validNode(sibling))
            continue;
          elementIndex += 1;
          if (sibling === node) {
            ownIndex = elementIndex;
            continue;
          }
          if (needsNthChild)
            continue;
          if (sibling.nodeNameInCorrectCase() !== nodeName)
            continue;

          needsClassNames = true;
          var ownClassNames = prefixedOwnClassNamesArray.keySet(),
              ownClassNameCount = 0;
          for (var name in ownClassNames)
            ++ownClassNameCount;
          if (ownClassNameCount === 0) {
            needsNthChild = true;
            continue;
          }
          var siblingClassNamesArray = this.prefixedElementClassNames(sibling),
              siblingClassNamesArrayL = siblingClassNamesArray.length;
          for (var j = 0; j < siblingClassNamesArrayL; ++j) {
              var siblingClass = siblingClassNamesArray[j];
              if (!ownClassNames.hasOwnProperty(siblingClass))
                continue;
              delete ownClassNames[siblingClass];
              if (!--ownClassNameCount) {
                needsNthChild = true;
                break;
              }
          }
      }

      var result = nodeName;
      if (isTargetNode && nodeName === "input" && node.getAttribute("type") && !node.getAttribute("id") && !node.getAttribute("class"))
        result += "[type=\"" + node.getAttribute("type") + "\"]";
      if (needsNthChild) {
        result += ":nth-child(" + (ownIndex + 1) + ")";
      } else if (needsClassNames) {
        for (var prefixedName in prefixedOwnClassNamesArray.keySet())
          result += "." + escapeIdentifierIfNeeded(prefixedName.substr(1));
      }

      return new this.DOMNodePathStep(result, false);
    },


    onBeforeUnloadTutorialFn: function(evt) {
      return "You're in the middle of a tutorial. By navigating away you will lose the current status.";
    },

    strip: function(html){
       var tmp = document.createElement("DIV");
       tmp.innerHTML = html;
       return (tmp.textContent || tmp.innerText || "").trim();
    },

    isElementInViewport: function(elem) {
      var rect = elem.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
      );
    },

    checkFixedElement: function(elem, $) {
      var isFixed = elem.css('position') === 'fixed',
          parents = null,
          parentElement = null;
      if (isFixed) {
        return elem;
      } else {
        parents = elem.parents();
        parents.each(function(){
          if($(this).css('position') === 'fixed') {
            isFixed = true;
            parentElement = $(this);
            return false;
          }
        });
        if (isFixed) {
          return parentElement;
        }
      }
      return 'body';
    },

    getParameterByName: function(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

  }

  // extend DOMNodePathStep to return value on string manipulation
  utils.DOMNodePathStep.prototype.toString = function() {
    return this.value;
  }


  // export it
  ns.utils = utils;

})(this, __hermes_embed);
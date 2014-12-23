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

*/


!(function(w, ns) {
  'use strict';

  /**
  *
  * Labels object. It stores the labels used around the embed app
  *
  **/

  var labels = {
    alertBindTutorial           : 'you can\'t bind a tutorial start on <a> or <button type="submit"> elements! :(',
    elementNoMorePresent        : 'The element attached to the tip is no more present in this page! (hint: Is it maybe attached to a dynamically generated element?)',
    elementPositionFixedWarning : 'The item you\'re going to bind has position:fixed(or it has a parent with position:fixed). The tip will be bound to that element to preserve page scrolling. Check whether that fixed element doesn\'t have overflow:hidden. Proceed?',
    noMoreTips                  : 'No more tips to display for this tutorial!'
  }


  // export it
  ns.labels = labels;

})(this, __hermes_embed);
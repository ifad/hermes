__hermes_embed.init_tutorial = function($) {

  !(function(w, ns){

    if (ns.Tutorial) {
      return;
    }

    var DOC = $(document),
        BODY = $(document.body),
        DEFAULTS = {
          retrieveTutorialUrl: '/messages/tutorials/{{tutorial_id}}.js?site_ref=' + ns.site_ref,
          tipTargetAbsoluteQS: 'hermes_tutorial_id={{id}}&hermes_tip_index={{index}}&hermes_site_ref={{ref}}'
        }
    ;

    var Tutorial = function(options, startedOptions) {
      this.version = '0.1';
      if (startedOptions == null){
        this.options = $.extend({}, DEFAULTS, this.sanitize(options));
        this.init();
      } else {
        this.options = $.extend({}, DEFAULTS);
        this.initStarted(startedOptions);
      }
      return this;
    };

    Tutorial.prototype.getCurrentIndex = function() {
      return this.currentTipIndex;
    }

    Tutorial.prototype.getTotalTips = function() {
      return this.tips.length;
    }

    Tutorial.prototype.isStarted = function() {
      return this.started;
    }

    Tutorial.prototype.isEnd = function() {
      return this.currentTipIndex === (this.tips.length - 1);
    }

    Tutorial.prototype.isBeginning = function() {
      return this.currentTipIndex === 0;
    }

    Tutorial.prototype.checkPathAndDisplay = function(tip) {
      if (!tip) {
        alert(ns.labels.noMoreTips);
        this.end();
        return;
      }
      var cookieSiteRef = ns.utils.getParameterByName('hermes_site_ref');
      if (tip.ext_site === ''
          && cookieSiteRef !== ''
          && cookieSiteRef !== ns.site_ref
          && ns.instances.app.mode === 'started-tutorial') {
        tip.ext_site = cookieSiteRef;
      }

      if ( (tip.ext_site !== '' && ns.site_ref.indexOf(tip.ext_site) > -1)
          || (w.location.pathname === tip.path && tip.ext_site === '')
          || (tip.ext_site === '' && (tip.path === '' || tip.path === '/'))
         ) {
        ns.display(tip);
        this.options.progress_bar && ns.display({type: 'progressBar', tutorial: this});
      } else {
        ns.instances.app.deleteTutorialCookies();
        $(w).off('beforeunload');
        ns.DOM.overlay && ns.DOM.overlay.hide();
        if(tip.ext_site === '') {
          ns.instances.app.createTutorialCookies(this.id, this.currentTipIndex);
          window.location.href = tip.path;
        } else {
          var ext_ref = tip.ext_site + tip.path,
              absQS = this.options.tipTargetAbsoluteQS.replace('{{id}}', this.id)
                                         .replace('{{index}}', this.currentTipIndex)
                                         .replace('{{ref}}', this.options.site_ref);
          ext_ref = ext_ref + ((ext_ref.indexOf('?') > -1) ? '&' : '?');
          window.location.href = '//' + ext_ref + absQS;
        }
      }
    }

    Tutorial.prototype.next = function() {
      this.checkPathAndDisplay(this.tips[++this.currentTipIndex])
      return this;
    }

    Tutorial.prototype.prev = function() {
      this.checkPathAndDisplay(this.tips[--this.currentTipIndex]);
      return this;
    }

    Tutorial.prototype.restart = function() {
      this.currentTipIndex = -1;
      this.started = false;
      this.tutorialStarterDisplayed = false;
      ns.instances.app.deleteTutorialCookies();
      $(w).off('beforeunload');
      ns.publish('tutorialrestarted', [this]);
      return this;
    }

    Tutorial.prototype.updateTutorialList = function() {
      if (!!this.options.to_view) {
        var listElement = $('#hermes-tutorial-starter-' + this.id),
            totNewElement = listElement.parents('.hermes-available-tutorials').find('> div .label-success > span'),
            totNew = ~~totNewElement.text().trim()
        ;
        listElement.find('.label-success').remove();
        listElement.find(' > span').append($('<span><b>(already viewed)</b></span>'));
        if (totNew > 1) {
          totNewElement.text(totNew-1);
        } else {
          totNewElement.parent().remove();
        }
      }
    }

    Tutorial.prototype.end = function(skip) {
      this.currentTipIndex = -1;
      this.started = false;
      this.tutorialStarterDisplayed = false;
      !skip && this.updateTutorialList();
      ns.instances.app.deleteTutorialCookies();
      $(w).off('beforeunload');
      ns.publish('tutorialended', [this.options.url, skip]);
      return this;
    }

    Tutorial.prototype.start = function() {
      if (this.started || ns.activeTutorial instanceof Tutorial) {
        return;
      }
      if (ns.utils.strip(this.welcome) !== ""
          && (!this.tutorialStarterDisplayed)
          && this.currentTipIndex === -1
          && ns.instances.app.mode !== 'started-tutorial') {
        this.tutorialStarterDisplayed = true;
        ns.display({type: 'tutorialStarter', tutorial: this});
      } else {
        this.started = true;
        $(w).on('beforeunload', ns.utils.onBeforeUnloadTutorialFn);
        ns.publish('tutorialstarted', [this]);
        this.next();
      }
      return this;
    }

    Tutorial.prototype.sanitize = function(data) {
      var tips = data.tips,
          len = tips.length,
          elem = null,
          currTip
      ;
      while (len--) {
        currTip = tips[len];
        if(currTip.type === 'tip') {
          elem = $(currTip.selector);
          ( currTip.ext_site === ''
            && this.siteRef === ns.site_ref
            && w.location.pathname === currTip.path
            && (elem.length === 0 || !elem.is(':visible'))
          ) && tips.splice(len, 1);
        }
      };
      return data;
    }

    Tutorial.prototype.initStarted = function(startedOptions) {
      var url = this.options.retrieveTutorialUrl.replace('{{tutorial_id}}', startedOptions.tutorialId);
      $.ajax(ns.host + url, {
        dataType: 'jsonp',
        success: function(data) {
          var tipIndex = null;
          if(data.length === 0) {
            ns.publish('tutorialdeleted');
          } else {
            this.siteRef = data[0].site_ref;
            $.extend(this.options, this.sanitize(data[0]));
            this.init(startedOptions.tipIndex);
          }
        }.bind(this)
      });
    }

    Tutorial.prototype.init = function(tipIndex) {
      var startElement = null;
      this.id = this.options.id;
      this.currentTipIndex = tipIndex ? tipIndex-1 : -1;
      this.tips = this.options.tips;
      this.selector = this.options.selector;
      this.title = this.options.title;
      this.welcome = this.options.welcome;
      this.tutorialStarterDisplayed = false;
      this.tips.forEach(function(tip){
        tip.tutorial_ref = this;
      }.bind(this));
      if (this.selector) {
        startElement = $(this.selector).first();
        startElement && startElement.on('click', this.start.bind(this));
        tipIndex && this.start();
      } else {
        this.start();
      }
      return this;
    }

    ns.Tutorial = Tutorial;

  })(window, __hermes_embed);

};
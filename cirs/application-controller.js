App.ApplicationRoute = Ember.Route.extend({
  actions: {
    openSidebar: function (modalName, model, isNew, menuId, controllerProperties) {
      isNew = isNew ? true : false;
      var controller = this.controllerFor(modalName);
      controller.set('model', model);
      controller.isNew = isNew;
      controller.selectedModuleMenu = menuId;

      if (controllerProperties) {
        controller.setProperties(controllerProperties);
      }
      this.setButtonText(controller, isNew);

      this.set('controller.showSidebar', true);
      return this.render(modalName, {
        into: 'application',
        outlet: 'sidebar'
      });
    },
    closeSidebar: function () {
      if (this.get('controller.showSidebar')) {
        this.set('controller.showSidebar', false);
        var self = this;
        setTimeout(function () {
          self.disconnectOutlet({
            outlet: 'sidebar',
            parentView: 'application'
          });
        }, 500);
      }
    }
  },

  setButtonText: function (controller, isNew) {
    var buttonText = App.config.getButtonName(isNew);
    var saveCloseButtonText = App.config.getSaveCloseButtonName(isNew);

    controller.set('buttonText', buttonText);
    controller.set('saveCloseButtonText', saveCloseButtonText);
  }
});

App.ApplicationController = Ember.Controller.extend({
  newVersionReady: false,
  downloadingNewVersion: false,
  showSidebar: false,

  init: function () {
    this._super();

    // setup online/offline status
    var updateNetworkStatus = function () {
      var online = App.get('isNetworkConnected');
      if (online !== navigator.onLine) {
        App.set('isNetworkConnected', navigator.onLine);
        // if we just moved from offline to online check for app update
        if (navigator.onLine) {
          window.applicationCache.update();
        }
      }
    };
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus();

    var updateServiceStatus = function (status) {
      App.set('isServiceAvailable', status.type !== 'error');
    };

    // check for new version of the app
    if (window.applicationCache) {

      // use new app version detection to see if the service is up
      window.applicationCache.addEventListener('error', updateServiceStatus);
      window.applicationCache.addEventListener('noupdate', updateServiceStatus);
      window.applicationCache.addEventListener('updateready', updateServiceStatus);

      var self = this;
      var onUpdateReady = function () {
        self.set('isNewVersionReady', true);
        App.flash.info('A new version of FAR has been downloaded and is ready to be used.',
          'Application Updated', { onclick: function () { window.location.reload(); } });
      };
      window.applicationCache.addEventListener('updateready', onUpdateReady);
      if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
        onUpdateReady();
      }

      // add periodic check for a new app version
      if (!Ember.testing) {
        setInterval(function () {
          if (App.get('isNetworkConnected')) {
            window.applicationCache.update();
          }
        }, App.config.onlineStatusCheckInterval);
      }

      // handle downloading events
      var downloading = function (event) {
        self.set('isNewVersionReady', false);
        self.set('downloadingNewVersion', true);
      };
      window.applicationCache.addEventListener('downloading', downloading);
    }
  },

  actions: {
    reloadApplication: function () {
      window.location.reload();
    }
  }
});

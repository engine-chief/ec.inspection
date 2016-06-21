// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('ionicApp', ['ionic', 'ionicApp.controllers', 'ngCordova', 'ui.router', 'ionic-ratings'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  // login view
  .state('tab.login', {
    url: '/login',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  // search view
  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('tab.truck', {
    url: '/truck',
    cache: 'false',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-truck.html',
        controller: 'TruckCtrl'
      }
    }
  })

  .state('tab.documents', {
    url: '/truck/documents',
    cache: 'false',
    views: {
      'tab-search': {
        templateUrl: 'templates/section-documents.html',
        controller: 'DocCtrl'
      }
    }
  })

  .state('tab.ga', {
    url: '/truck/ga',
    cache: 'false',
    views: {
      'tab-search': {
        templateUrl: 'templates/section-general-appearance.html',
        controller: 'GACtrl'
      }
    }
  })

  .state('tab.chassis', {
    url: '/truck/chassis',
    cache: 'false',
    views: {
      'tab-search': {
        templateUrl: 'templates/section-chassis.html',
        controller: 'ChassisCtrl'
      }
    }
  })

  .state('tab.engine', {
    url: '/truck/engine',
    cache: 'false',
    views: {
      'tab-search': {
        templateUrl: 'templates/section-engine.html',
        controller: 'EngineCtrl'
      }
    }
  })

  .state('tab.cabin', {
    url: '/truck/cabin',
    cache: 'false',
    views: {
      'tab-search': {
        templateUrl: 'templates/section-cabin.html',
        controller: 'CabinCtrl'
      }
    }
  })

  .state('tab.tyres', {
    url: '/truck/tyres',
    cache: 'false',
    views: {
      'tab-search': {
        templateUrl: 'templates/section-tyres.html',
        controller: 'TyresCtrl'
      }
    }
  })

  .state('tab.final', {
    url: '/truck/final',
    cache: 'false',
    views: {
      'tab-search': {
        templateUrl: 'templates/section-final.html',
        controller: 'FinalCtrl'
      }
    }
  })

  .state('tab.truckimg', {
    url: '/truck/0',
    views: {
      'tab-search': {
        templateUrl: 'templates/truckimg.html',
        controller: 'TruckImgCtrl'
      }
    }
  })

  .state('tab.truckimgg', {
    url: '/truck/1',
    views: {
      'tab-truck': {
        templateUrl: 'templates/truckimgg.html',
        controller: 'TruckImgCtrll'
      }
    }
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/login');

});
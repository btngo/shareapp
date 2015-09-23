// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'restangular',
  'starter.controllers',
  'ionic-utils',
  'ngCordova',
  'ionic-datepicker',
  'ionic-timepicker'
])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
      })

      .state('app.utils', {
        url: "/utils",
        views: {
          'menuContent': {
            templateUrl: "templates/utils.html",
            controller: 'ContactCtrl'
          }
        }
      })

      .state('app.favorites', {
        url: "/favorites",
        views: {
          'menuContent': {
            templateUrl: "templates/favorites.html",
            controller: 'LocationCtrl'
          }
        }
      })

      .state('app.agenda', {
        url: "/agenda",
        views: {
          'menuContent': {
            templateUrl: "templates/agenda.html",
            controller: 'AgendaCtrl'
          }
        }
      })

      .state('app.agenda-detail', {
        url: "/agenda/:eventId",
        views: {
          'menuContent': {
            templateUrl: "templates/agenda-detail.html",
            controller: 'AgendaDetailCtrl'
          }
        }
      })

      .state('app.setting', {
        url: "/setting",
        views: {
          'menuContent': {
            templateUrl: "templates/setting.html",
            controller: 'SettingCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/agenda');
  })
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  });
﻿'use strict';

var flashCardsModule = angular.module('flashCardsModule', ['ui.router']);

flashCardsModule.service(FlashCards.services);
flashCardsModule.controller(FlashCards.controllers);

flashCardsModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider) {
  //$locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');

  $stateProvider.state('flashCards', { url: '/', templateUrl: 'flashCards',  });
  $stateProvider.state('settings', { url: '/settings', templateUrl: 'settings' });
  $stateProvider.state('about', { url: '/about', templateUrl: 'about' });
  $stateProvider.state('stats', { url: '/stats', templateUrl: 'stats' });
  $stateProvider.state('login', { url: '/login', templateUrl: 'login' });
}]);

flashCardsModule.directive('shortcut', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    link: function postLink(scope) {
      $().on('keypress', function (e) {
        scope.$apply(scope.onKeyPressed(e));
      });
    }
  };
});

flashCardsModule.directive('autoFocus', ['$timeout',function ($timeout) {
  return {
    restrict: 'AC',
    link: function (scope, element) {
      $timeout(function () {
        element[0].focus();
      }, 0);
    }
  };
}]);
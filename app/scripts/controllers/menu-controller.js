'use strict';

FlashCards.controllers.MenuController = ['$scope', 'FlashCardsService', function ($scope, flashCardsService) {
  $scope.score = function () {
    return flashCardsService.score();
  };
}];
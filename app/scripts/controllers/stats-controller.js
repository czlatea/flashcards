'use strict';

FlashCards.controllers.StatsController = ['$scope', 'FlashCardsService', function ($scope, flashCardsService) {
  $scope.getStats = function () {
    return flashCardsService.getStats();
  };
}];
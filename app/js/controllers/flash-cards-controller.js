﻿FlashCards.controllers.FlashCardsController = ['$scope', 'FlashCardsService', function ($scope, flashCardsService) {

  $scope.init=function () {
    $scope.words = flashCardsService.getWords();
    $scope.index = 0;
    $scope.state = null;
    $scope.translation = null;
  };

  $scope.init();

  $scope.word = function () {
    var word = $scope.words[$scope.index];
    if (!word) {
      this.init();
      if ($scope.words.length == 0) {
        $scope.noWords = true;
        return null;
      } else {
        return $scope.word();
      }
    }
      
    $scope.noWords = false;
    return word;
  };

  $scope.score = function () {
    return flashCardsService.score;
  };

  $scope.actions = {
    next: function () {
      $scope.index++;
      $scope.state = null;
      $scope.translation = null;
    },

    submit: function () {
      var ok = flashCardsService.process($scope.word(), $scope.translation);
      $scope.state = ok ? "success" : "error";
    }
  };

  $scope.cssClass = function() {
    switch ($scope.state) {
    case "error":
      return "x-panel-error";
    case "success":
      return "x-panel-success";
    default:
      return null;
    }
  };
}];
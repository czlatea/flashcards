FlashCards.controllers.FlashCardsController = ['$scope', 'FlashCardsService', function ($scope, flashCardsService) {

  function init() {
    $scope.words = flashCardsService.getWords();
    $scope.index = 0;
    $scope.state = null;
    $scope.translation = null;
  };

  init();

  $scope.word = function () {
    var word = $scope.words[$scope.index];
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
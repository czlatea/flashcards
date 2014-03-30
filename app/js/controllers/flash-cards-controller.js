FlashCards.controllers.FlashCardsController = ['$scope','FlashCardsService',function($scope,flashCardsService) {
  $scope.words = flashCardsService.getWords();
}];
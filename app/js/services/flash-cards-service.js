FlashCards.services.FlashCardsService = function () {
  this.score = 0;

  this.getWords = function () {
    return FlashCards.words;
  };

  this.process = function (word, translation) {
    translation = translation || "";
    var result = word.de.toLocaleLowerCase() === translation.toLowerCase();

    if (result) {
      this.score += word.level;
      //todo move the word in next box
    } else {
      //todo deduct score and move the word in previous box
    }

    return result;
  };
};
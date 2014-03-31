'use strict';

FlashCards.services.FlashCardsService = ['FlashCardsDA', function (flashCardsDA) {
  this.score = 0;

  this.getWords = function () {
    var date = moment();
    var processedWords = flashCardsDA.getProcessedWords();
    return _.where(FlashCards.words, function (word) {
      var processedWord = _.find(processedWords, { id: word.id });

      word.box = processedWord ? processedWord.box : 1;

      return !processedWord || moment(processedWord.scheduledFor) < date;
    });
  };

  this.process = function (word, translation) {
    translation = translation || '';
    var result = word.de.toLocaleLowerCase() === translation.toLowerCase();

    var increment = result ? 1 : -1;

    word.points = word.box * word.level*increment;
    word.box = word.box + increment;

    if (word.box === 0) {
      word.box = 1;
      word.points = 0;
    }

    this.score += word.points;

    flashCardsDA.updateProcessedWord(word);
    return result;
  };
}];

FlashCards.services.FlashCardsDA = function () {
  this.localStorageKey = 'FlashCards';
  this._processedWords = null;

  this.getProcessedWords = function () {
    if (!this._processedWords) {
      var content = localStorage.getItem(this.localStorageKey);
      this._processedWords = content ? JSON.parse(content) : [];
    }

    return this._processedWords;
  };

  this.updateProcessedWords = function (processedWords) {
    var content = JSON.stringify(processedWords || {});
    localStorage.setItem(this.localStorageKey, content);
    this._processedWords = null;
  };

  this.updateProcessedWord = function (word) {
    var processedWords = this.getProcessedWords();
    var processedWord = _.findWhere(processedWords, { id: word.id });
    if (!processedWord) {
      processedWord = { count: 0 };
      processedWords.push(processedWord);
    }

    processedWord.id = word.id;
    processedWord.count++;
    processedWord.box = word.box;
    processedWord.scheduledFor = moment().add('days', FlashCards.config.boxes[processedWord.box-1].interval);


    this.updateProcessedWords(processedWords);
  };
};
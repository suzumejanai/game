var game = {
  stages: [
    { correct: "ダンダダン", wrong: ["ダダンダン", "ダンダンダン", "ダンダダダン", "ダンダンダダン", "ダダダンダン", "ダンダンダンダン", "ダダダダン", "ダンダン", "ダンダダンダン", "ダンダンダダダン"] },
    { correct: "おのののか", wrong: ["おののののか", "おのかののか", "おのののかか", "おののかか", "おのおのか", "おかののの", "おのののかの", "おのおかか", "おののかかか", "おかのかの"] },
    { correct: "ボボボーボボーボボ", wrong: ["ボボボーボーボーボ", "ボボボーボボボボ", "ボボーボボボーボ", "ボボーボボボボボ", "ボーボボーボボーボ", "ボボボーボーボーボーボ", "ボーボボーボボ", "ボボボボボーボボ", "ボボーボボーボーボ", "ボボボボボボーボボ"] }
  ],
  currentStage: 0,
  correctClicks: 0,
  isCorrectTextDisplayed: false,
  timeLeft: 30,
  gameInterval: null,
  textUpdateInterval: null,
  textUpdateCount: 0,
  lastCorrectTime: 0,

  showScreen: function(screenId) {
    var screens = document.getElementsByClassName('screen');
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.remove('active');
    }
    document.getElementById(screenId).classList.add('active');
  },

  startGame: function() {
    this.currentStage = 0;
    this.showStageStart();
  },

  showStageStart: function() {
    document.getElementById('stage-number').textContent = this.currentStage + 1;
    document.getElementById('correct-answer').textContent = this.stages[this.currentStage].correct;
    this.showScreen('stage-start-screen');
  },

  startStage: function() {
    this.showScreen('game-screen');
    this.correctClicks = 0;
    this.timeLeft = 30;
    this.textUpdateCount = 0;
    this.lastCorrectTime = 0;
    this.updateStage();
    this.updateSuccessCount();
    this.updateText();
    this.startTimer();
    this.startTextUpdate();
  },

  updateText: function() {
    this.textUpdateCount++;
    var currentTime = Date.now();
    var timeSinceLastCorrect = currentTime - this.lastCorrectTime;

    if (this.textUpdateCount >= 8 || (Math.random() < 0.2 && timeSinceLastCorrect > 2000) || this.correctClicks === 2) {
      document.getElementById('text-display').textContent = this.stages[this.currentStage].correct;
      this.isCorrectTextDisplayed = true;
      this.textUpdateCount = 0;
    } else {
      var wrongText = this.stages[this.currentStage].wrong[Math.floor(Math.random() * this.stages[this.currentStage].wrong.length)];
      document.getElementById('text-display').textContent = wrongText;
      this.isCorrectTextDisplayed = false;
    }
  },

  updateStage: function() {
    document.getElementById('stage').textContent = 'ステージ: ' + (this.currentStage + 1);
  },

  updateSuccessCount: function() {
    document.getElementById('success-count').textContent = '成功回数: ' + this.correctClicks + ' / 3';
  },

  startTimer: function() {
    clearInterval(this.gameInterval);
    var self = this;
    this.gameInterval = setInterval(function() {
      self.timeLeft--;
      document.getElementById('time').textContent = '残り時間: ' + self.timeLeft + '秒';
      if (self.timeLeft <= 0) {
        self.endGame(true);
      }
    }, 1000);
  },

  startTextUpdate: function() {
    clearInterval(this.textUpdateInterval);
    var self = this;
    this.textUpdateInterval = setInterval(function() {
      self.updateText();
    }, 1500);
  },

  showFeedback: function(message, isFailure, isStageClear) {
    var textDisplay = document.getElementById('text-display');
    textDisplay.textContent = message;
    textDisplay.className = isFailure ? 'failure' : (isStageClear ? 'stage-clear' : '');
    clearInterval(this.textUpdateInterval);
    var self = this;
    setTimeout(function() {
      textDisplay.className = '';
      if (!isFailure && !isStageClear) {
        self.updateText();
        self.startTextUpdate();
      }
    }, 1000);
  },

  endGame: function(isGameOver) {
    clearInterval(this.gameInterval);
    clearInterval(this.textUpdateInterval);
    var gameOverDisplay = document.getElementById('game-over');
    if (isGameOver) {
      gameOverDisplay.textContent = "ゲームオーバー";
      gameOverDisplay.style.color = "#FF0000";
    } else {
      gameOverDisplay.textContent = "全ステージクリア！おめでとう！";
      gameOverDisplay.style.color = "#4CAF50";
    }
    this.showScreen('result-screen');
  },

  checkAnswer: function() {
    if (this.isCorrectTextDisplayed) {
      this.correctClicks++;
      this.showFeedback("正解！");
      this.updateSuccessCount();
      this.lastCorrectTime = Date.now();
      if (this.correctClicks === 3) {
        this.showFeedback("ステージクリア！", false, true);
        this.currentStage++;
        if (this.currentStage >= this.stages.length) {
          var self = this;
          setTimeout(function() {
            self.endGame(false);
          }, 1000);
          return;
        }
        var self = this;
        setTimeout(function() {
          self.showStageStart();
        }, 1000);
      } else {
        var self = this;
        setTimeout(function() {
          var wrongText = self.stages[self.currentStage].wrong[Math.floor(Math.random() * self.stages[self.currentStage].wrong.length)];
          document.getElementById('text-display').textContent = wrongText;
          self.isCorrectTextDisplayed = false;
          self.startTextUpdate();
        }, 1000);
      }
    } else {
      this.showFeedback("不正解", true);
      var self = this;
      setTimeout(function() {
        self.endGame(true);
      }, 1000);
    }
  }
};

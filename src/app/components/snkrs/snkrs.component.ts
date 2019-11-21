import { Component, OnInit, OnDestroy } from '@angular/core';
import { SnkrsService } from 'src/app/services/snkrs.service';
import { AuthService } from 'src/app/services/auth.service';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';

class Question {
  answers: Array<any>;
  assetURL: string;
  correctAnswer: string;
}

@Component({
  selector: 'app-snkrs',
  templateUrl: './snkrs.component.html',
  styleUrls: ['./snkrs.component.scss']
})
export class SnkrsComponent implements OnInit, OnDestroy {

  UID: string;
  gameID: string;
  qID: string;

  countdown = 10;
  pageCountdown = 3;

  countdownDisplay: number;
  countdownInterval: NodeJS.Timer;
  animationInterval: NodeJS.Timer;

  // Pages boolean
  howItWorksPage = true;
  countdownPage = false;
  resultPage = false;
  totalPage = false;
  questionPage = false;

  // Game Variables
  questions = [];
  currentQuestion: Question;
  numQuestionAnswered = 0;
  resultInfo = {
    correctAnswer: '',
    userAnswer: '',
    points: 0
  }

  timestamp = Date.now();

  constructor(
    private snkrsService: SnkrsService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.isConnected().then(res => {
      if (isNullOrUndefined(res)) {
        this.router.navigate(['/login'], {
          queryParams: { redirectTo: '/contest' }
        });
      } else {
        this.UID = res.uid;
        this.snkrsService.getGameID(this.timestamp).then(response => {
          // console.log(response);
          if (response) {
            this.gameID = response[0] as string;
            this.qID = response[1] as string;
          } else {
            this.router.navigate(['..']);
          }
        });
        //console.log(this.UID);
      }
    });
  }

  ngOnDestroy() {
    console.log('work');
  }

  startCountdown(seconds: number, int: number) {
    this.countdownDisplay = seconds;

    this.countdownInterval = setInterval(() => {
      this.countdownDisplay--;
      this.countdownBorderAnimation(this.countdownDisplay, int);

      if (this.countdownDisplay <= 0) {
        clearTimeout(this.countdownInterval);
      }
    }, int);
  }

  countdownBorderAnimation(countdown: number, int: number) {
    let color: string;
    let animation = 0;

    if (countdown > 5) {
      color = "#98fb98";
    } else if (countdown <= 5 && countdown > 2) {
      color = "#f1f51b";
    } else if (countdown <= 2 && countdown > 1) {
      color = "#f79e1b";
    } else if (countdown <= 1 && countdown > 0) {
      color = "#f55c1b";
    } else {
      color = "#f51b1b";
    }

    this.animationInterval = setInterval(() => {
      if (animation === 0) {
        document.getElementById('countdown').style.borderTopColor = color;
        animation++;
      } else if (animation === 1) {
        document.getElementById('countdown').style.borderRightColor = color;
        animation++;
      } else if (animation === 2) {
        document.getElementById('countdown').style.borderBottomColor = color;
        animation++;
      } else {
        document.getElementById('countdown').style.borderLeftColor = color;
        clearTimeout(this.animationInterval);

        setTimeout(() => {
          document.getElementById('countdown').style.borderLeftColor = "#222021";
          document.getElementById('countdown').style.borderBottomColor = "#222021";
          document.getElementById('countdown').style.borderRightColor = "#222021";
          document.getElementById('countdown').style.borderTopColor = "#222021";
        }, int * 0.15);
      }
    }, int * 0.20);
  }

  goToQuestion() {
    setTimeout(() => {
      this.howItWorksPage = false;
      this.countdownPage = false;
      this.resultPage = false;
      this.totalPage = false;
      this.questionPage = true;

      setTimeout(() => {
        this.startCountdown(this.countdown, 1000);
      }, 1000);

    }, 500);
  }

  goToCountdown() {
    setTimeout(() => {
      this.howItWorksPage = false;
      this.countdownPage = true;
      this.resultPage = false;
      this.totalPage = false;
      this.questionPage = false;

      setTimeout(() => {
        this.startCountdown(this.pageCountdown, 2000);

        setTimeout(() => {
          this.goToQuestion();
        }, 8000);
      }, 1000);

    }, 500);
  }

  goToResult() {
    clearTimeout(this.countdownInterval);
    clearTimeout(this.animationInterval);
    setTimeout(() => {
      this.howItWorksPage = false;
      this.countdownPage = false;
      this.resultPage = true;
      this.totalPage = false;
      this.questionPage = false;
      clearTimeout();
    }, 500);
  }

  selectAnswer($event) {
    const answerPicked = $event.target.innerHTML;
    this.goToResult();

    if (this.currentQuestion.correctAnswer === answerPicked) {
      this.resultInfo.correctAnswer = this.currentQuestion.correctAnswer;
      this.resultInfo.points = 10;
      this.resultInfo.userAnswer = answerPicked;
    } else {
      this.resultInfo.correctAnswer = this.currentQuestion.correctAnswer;
      this.resultInfo.points = -2;
      this.resultInfo.userAnswer = answerPicked;
    }

    this.snkrsService.addUserAnswer(this.resultInfo, this.UID, this.gameID, this.qID).then(res => {
      if (res) {
        this.numQuestionAnswered++;
        this.cleanResultInfo();
        this.nextQuestion();
      } else {
        //this.router.navigate(['..']);
      }
    })
  }

  cleanResultInfo() {
    this.resultInfo.correctAnswer = '';
    this.resultInfo.points = 0;
    this.resultInfo.userAnswer = '';
  }

  nextQuestion() {
    this.currentQuestion = this.questions[this.numQuestionAnswered];
  }

  getQuestions() {
    this.snkrsService.getQuestions(this.gameID, this.qID).then(res => {
      this.questions = res.data().Q;
      this.currentQuestion = this.questions[0];
      console.log(this.questions);
    });
  }

  startGame() {
    this.goToCountdown();
    this.snkrsService.startGame(this.UID, this.gameID, this.qID).then(res => {
      if (typeof res === "boolean") {
        this.router.navigate(['..']);
      } else {
        this.numQuestionAnswered = res;
        this.getQuestions();
      }
    })
  }
}

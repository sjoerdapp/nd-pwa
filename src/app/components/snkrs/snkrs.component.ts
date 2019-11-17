import { Component, OnInit, OnDestroy } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-snkrs',
  templateUrl: './snkrs.component.html',
  styleUrls: ['./snkrs.component.scss']
})
export class SnkrsComponent implements OnInit, OnDestroy {

  countdown = 10;
  pageCountdown = 3;

  countdownDisplay: number;
  countdownInterval: NodeJS.Timer;

  // Pages boolean
  howItWorksPage = false;
  countdownPage = false;
  resultPage = false;
  totalPage = true;
  questionPage = false;

  constructor() { }

  ngOnInit() {

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
        clearInterval(this.countdownInterval);
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
    const interval = setInterval(() => {
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
        clearInterval(interval);

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
    setTimeout(() => {
      this.howItWorksPage = false;
      this.countdownPage = false;1
      this.resultPage = true;
      this.totalPage = false;
      this.questionPage = false;
      clearTimeout();
    }, 500);
  }

}

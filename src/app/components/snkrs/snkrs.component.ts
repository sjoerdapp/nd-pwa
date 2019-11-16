import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-snkrs',
  templateUrl: './snkrs.component.html',
  styleUrls: ['./snkrs.component.scss']
})
export class SnkrsComponent implements OnInit, OnDestroy {

  countdown = 10;
  pageCountdown = 6;

  // Pages boolean
  howItWorksPage = true;
  countdownPage = false;
  resultPage = false;
  totalPage = false;
  questionPage = false;

  constructor() { }

  ngOnInit() {

  }

  ngOnDestroy() {
    console.log('work');
  }

  startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      this.countdownBorderAnimation(this.countdown);

      if (this.countdown == 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  countdownBorderAnimation(countdown) {
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

        const reset = setTimeout(() => {
          document.getElementById('countdown').style.borderLeftColor = "#222021";
          document.getElementById('countdown').style.borderBottomColor = "#222021";
          document.getElementById('countdown').style.borderRightColor = "#222021";
          document.getElementById('countdown').style.borderTopColor = "#222021";
          clearTimeout(reset);
        }, 150);
      }
    }, 200);
  }

  goToQuestion() {
    setTimeout(() => {
      this.howItWorksPage = false;
      this.questionPage = true;
      
      setTimeout(() => {
        this.startCountdown();
      }, 1000);

    }, 500);
  }

}

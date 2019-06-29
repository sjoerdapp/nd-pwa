import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionReviewComponent } from './transaction-review.component';

describe('TransactionReviewComponent', () => {
  let component: TransactionReviewComponent;
  let fixture: ComponentFixture<TransactionReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

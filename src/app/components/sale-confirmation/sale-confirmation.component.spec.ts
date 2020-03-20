import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleConfirmationComponent } from './sale-confirmation.component';

describe('SaleConfirmationComponent', () => {
  let component: SaleConfirmationComponent;
  let fixture: ComponentFixture<SaleConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

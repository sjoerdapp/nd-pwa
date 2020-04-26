import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustboxComponent } from './trustbox.component';

describe('TrustboxComponent', () => {
  let component: TrustboxComponent;
  let fixture: ComponentFixture<TrustboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrustboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

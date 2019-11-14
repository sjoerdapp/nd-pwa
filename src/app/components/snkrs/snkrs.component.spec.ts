import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnkrsComponent } from './snkrs.component';

describe('SnkrsComponent', () => {
  let component: SnkrsComponent;
  let fixture: ComponentFixture<SnkrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnkrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnkrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

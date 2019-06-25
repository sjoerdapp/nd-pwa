import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsShippingComponent } from './settings-shipping.component';

describe('SettingsShippingComponent', () => {
  let component: SettingsShippingComponent;
  let fixture: ComponentFixture<SettingsShippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

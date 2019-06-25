import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPayoutComponent } from './settings-payout.component';

describe('SettingsPayoutComponent', () => {
  let component: SettingsPayoutComponent;
  let fixture: ComponentFixture<SettingsPayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

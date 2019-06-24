import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSellingComponent } from './settings-selling.component';

describe('SettingsSellingComponent', () => {
  let component: SettingsSellingComponent;
  let fixture: ComponentFixture<SettingsSellingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsSellingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

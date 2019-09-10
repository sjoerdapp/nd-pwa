import { TestBed } from '@angular/core/testing';

import { SettingsPasswordService } from './settings-password.service';

describe('SettingsPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsPasswordService = TestBed.get(SettingsPasswordService);
    expect(service).toBeTruthy();
  });
});

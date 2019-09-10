import { TestBed } from '@angular/core/testing';

import { SettingsProfileService } from './settings-profile.service';

describe('SettingsProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsProfileService = TestBed.get(SettingsProfileService);
    expect(service).toBeTruthy();
  });
});

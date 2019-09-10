import { TestBed } from '@angular/core/testing';

import { SettingsShippingService } from './settings-shipping.service';

describe('SettingsShippingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsShippingService = TestBed.get(SettingsShippingService);
    expect(service).toBeTruthy();
  });
});

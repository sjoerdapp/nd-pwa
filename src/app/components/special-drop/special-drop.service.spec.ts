import { TestBed } from '@angular/core/testing';

import { SpecialDropService } from './special-drop.service';

describe('SpecialDropService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpecialDropService = TestBed.get(SpecialDropService);
    expect(service).toBeTruthy();
  });
});

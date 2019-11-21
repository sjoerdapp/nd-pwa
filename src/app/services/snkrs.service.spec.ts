import { TestBed } from '@angular/core/testing';

import { SnkrsService } from './snkrs.service';

describe('SnkrsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SnkrsService = TestBed.get(SnkrsService);
    expect(service).toBeTruthy();
  });
});

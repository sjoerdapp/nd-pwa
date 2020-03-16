import { TestBed } from '@angular/core/testing';

import { SaleConfirmationService } from './sale-confirmation.service';

describe('SaleConfirmationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaleConfirmationService = TestBed.get(SaleConfirmationService);
    expect(service).toBeTruthy();
  });
});

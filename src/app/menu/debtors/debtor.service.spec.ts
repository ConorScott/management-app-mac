import { TestBed } from '@angular/core/testing';

import { DebtorService } from './debtor.service';

describe('DebtorService', () => {
  let service: DebtorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebtorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

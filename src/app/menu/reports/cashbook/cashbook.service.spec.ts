import { TestBed } from '@angular/core/testing';

import { CashbookService } from './cashbook.service';

describe('CashbookService', () => {
  let service: CashbookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashbookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

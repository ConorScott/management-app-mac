import { TestBed } from '@angular/core/testing';

import { TipPaymentsService } from './tip-payments.service';

describe('TipPaymentsService', () => {
  let service: TipPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

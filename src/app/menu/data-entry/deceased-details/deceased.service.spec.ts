import { TestBed } from '@angular/core/testing';

import { DeceasedService } from './deceased.service';

describe('DeceasedService', () => {
  let service: DeceasedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeceasedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

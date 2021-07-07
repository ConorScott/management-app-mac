import { TestBed } from '@angular/core/testing';

import { CoffinService } from './coffin.service';

describe('CoffinService', () => {
  let service: CoffinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoffinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

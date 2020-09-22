import { TestBed } from '@angular/core/testing';

import { BdaService } from './bda.service';

describe('BdaService', () => {
  let service: BdaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BdaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

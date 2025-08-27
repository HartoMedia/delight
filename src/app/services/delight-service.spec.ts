import { TestBed } from '@angular/core/testing';

import { DelightService } from './delight-service';

describe('DelightService', () => {
  let service: DelightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

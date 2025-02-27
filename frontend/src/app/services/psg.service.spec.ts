import { TestBed } from '@angular/core/testing';

import { PsgService } from './psg.service';

describe('PsgService', () => {
  let service: PsgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PsgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

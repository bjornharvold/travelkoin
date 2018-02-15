import { TestBed, inject } from '@angular/core/testing';

import { MandrillService } from './mandrill.service';

describe('MandrillService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MandrillService]
    });
  });

  it('should be created', inject([MandrillService], (service: MandrillService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { CrowdsaleTimerService } from './crowdsale-timer.service';

describe('CrowdsaleTimerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrowdsaleTimerService]
    });
  });

  it('should be created', inject([CrowdsaleTimerService], (service: CrowdsaleTimerService) => {
    expect(service).toBeTruthy();
  }));
});

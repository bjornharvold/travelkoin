import { TestBed, inject } from '@angular/core/testing';

import { TransactionLogService } from './transaction-log.service';

describe('TransactionLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionLogService]
    });
  });

  it('should be created', inject([TransactionLogService], (service: TransactionLogService) => {
    expect(service).toBeTruthy();
  }));
});

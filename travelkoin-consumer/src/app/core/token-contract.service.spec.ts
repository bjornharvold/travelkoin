import { TestBed, inject } from '@angular/core/testing';

import { TokenContractService } from './token-contract.service';

describe('TokenContractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenContractService]
    });
  });

  it('should be created', inject([TokenContractService], (service: TokenContractService) => {
    expect(service).toBeTruthy();
  }));
});

/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {inject, TestBed} from '@angular/core/testing';

import {CheckForUpdateService} from './check-for-update.service';

describe('CheckForUpdateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckForUpdateService]
    });
  });

  it('should be created', inject([CheckForUpdateService], (service: CheckForUpdateService) => {
    expect(service).toBeTruthy();
  }));
});

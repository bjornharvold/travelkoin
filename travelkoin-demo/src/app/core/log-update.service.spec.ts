/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {inject, TestBed} from '@angular/core/testing';

import {LogUpdateService} from './log-update.service';

describe('LogUpdateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogUpdateService]
    });
  });

  it('should be created', inject([LogUpdateService], (service: LogUpdateService) => {
    expect(service).toBeTruthy();
  }));
});

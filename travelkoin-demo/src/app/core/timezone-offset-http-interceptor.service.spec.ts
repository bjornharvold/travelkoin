/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {inject, TestBed} from '@angular/core/testing';

import {TimezoneOffsetHttpInterceptorService} from './timezone-offset-http-interceptor.service';

describe('TimezoneOffsetHttpInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimezoneOffsetHttpInterceptorService]
    });
  });

  it('should be created', inject([TimezoneOffsetHttpInterceptorService], (service: TimezoneOffsetHttpInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});

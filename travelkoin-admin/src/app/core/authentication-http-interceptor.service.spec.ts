/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {inject, TestBed} from '@angular/core/testing';

import {AuthenticationHttpInterceptorService} from './authentication-http-interceptor.service';

describe('AuthenticationHttpInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationHttpInterceptorService]
    });
  });

  it('should be created', inject([AuthenticationHttpInterceptorService], (service: AuthenticationHttpInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});

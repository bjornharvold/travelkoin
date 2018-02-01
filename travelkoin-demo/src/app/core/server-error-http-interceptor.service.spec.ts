/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {inject, TestBed} from '@angular/core/testing';

import {ServerErrorHttpInterceptorService} from './server-error-http-interceptor.service';

describe('ServerErrorHttpInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerErrorHttpInterceptorService]
    });
  });

  it('should be created', inject([ServerErrorHttpInterceptorService], (service: ServerErrorHttpInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});

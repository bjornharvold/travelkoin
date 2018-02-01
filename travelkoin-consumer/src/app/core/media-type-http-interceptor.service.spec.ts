/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {inject, TestBed} from '@angular/core/testing';

import {MediaTypeHttpInterceptorService} from './media-type-http-interceptor.service';

describe('AcceptContentTypeHttpInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaTypeHttpInterceptorService]
    });
  });

  it('should be created', inject([MediaTypeHttpInterceptorService], (service: MediaTypeHttpInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});

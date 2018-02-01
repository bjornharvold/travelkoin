/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {inject, TestBed} from '@angular/core/testing';

import {AuthenticationTokenService} from './authentication-token.service';

describe('AuthenticationTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationTokenService]
    });
  });

  it('should be created', inject([AuthenticationTokenService], (service: AuthenticationTokenService) => {
    expect(service).toBeTruthy();
  }));
});

/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {inject, TestBed} from '@angular/core/testing';

import {UserSessionService} from './user-session.service';

describe('UserSessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserSessionService]
    });
  });

  it('should ...', inject([UserSessionService], (service: UserSessionService) => {
    expect(service).toBeTruthy();
  }));
});

/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {inject, TestBed} from '@angular/core/testing';

import {ServerHeartBeatService} from './server-heart-beat.service';

describe('ServerHeartBeatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerHeartBeatService]
    });
  });

  it('should be created', inject([ServerHeartBeatService], (service: ServerHeartBeatService) => {
    expect(service).toBeTruthy();
  }));
});

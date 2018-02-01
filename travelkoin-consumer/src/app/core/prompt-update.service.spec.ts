/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {inject, TestBed} from '@angular/core/testing';

import {PromptUpdateService} from './prompt-update.service';

describe('PromptUpdateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromptUpdateService]
    });
  });

  it('should be created', inject([PromptUpdateService], (service: PromptUpdateService) => {
    expect(service).toBeTruthy();
  }));
});

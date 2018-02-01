/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WhatAreYouWaitingForComponent} from './what-are-you-waiting-for.component';

describe('WhatAreYouWaitingForComponent', () => {
  let component: WhatAreYouWaitingForComponent;
  let fixture: ComponentFixture<WhatAreYouWaitingForComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WhatAreYouWaitingForComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatAreYouWaitingForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

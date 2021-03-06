/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AdvisorsComponent} from './advisors.component';

describe('AdvisorsComponent', () => {
  let component: AdvisorsComponent;
  let fixture: ComponentFixture<AdvisorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdvisorsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

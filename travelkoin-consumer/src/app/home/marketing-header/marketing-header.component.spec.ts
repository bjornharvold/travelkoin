/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MarketingHeaderComponent} from './marketing-header.component';

describe('MarketingHeaderComponent', () => {
  let component: MarketingHeaderComponent;
  let fixture: ComponentFixture<MarketingHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketingHeaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

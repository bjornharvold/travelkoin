/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GlobalLoyaltyPlatformComponent} from './global-loyalty-platform.component';

describe('GlobalLoyaltyPlatformComponent', () => {
  let component: GlobalLoyaltyPlatformComponent;
  let fixture: ComponentFixture<GlobalLoyaltyPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalLoyaltyPlatformComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalLoyaltyPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

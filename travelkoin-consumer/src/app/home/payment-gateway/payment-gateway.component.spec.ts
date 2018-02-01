/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PaymentgatewayComponent} from './payment-gateway.component';

describe('PaymentgatewayComponent', () => {
  let component: PaymentgatewayComponent;
  let fixture: ComponentFixture<PaymentgatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentgatewayComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentgatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

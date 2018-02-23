import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartContractDateTimeComponent } from './smart-contract-date-time.component';

describe('SmartContractDateTimeComponent', () => {
  let component: SmartContractDateTimeComponent;
  let fixture: ComponentFixture<SmartContractDateTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartContractDateTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartContractDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

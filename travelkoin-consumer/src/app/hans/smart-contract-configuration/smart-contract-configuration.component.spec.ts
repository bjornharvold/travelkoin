import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartContractConfigurationComponent } from './smart-contract-configuration.component';

describe('SmartContractConfigurationComponent', () => {
  let component: SmartContractConfigurationComponent;
  let fixture: ComponentFixture<SmartContractConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartContractConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartContractConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartContractWhitelistComponent } from './smart-contract-whitelist.component';

describe('SmartContractWhitelistComponent', () => {
  let component: SmartContractWhitelistComponent;
  let fixture: ComponentFixture<SmartContractWhitelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartContractWhitelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartContractWhitelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

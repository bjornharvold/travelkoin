import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingForApprovalUsersComponent } from './waiting-for-approval-users.component';

describe('WaitingForApprovalUsersComponent', () => {
  let component: WaitingForApprovalUsersComponent;
  let fixture: ComponentFixture<WaitingForApprovalUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingForApprovalUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingForApprovalUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

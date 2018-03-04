import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhitelistedUsersComponent } from './whitelisted-users.component';

describe('WhitelistedUsersComponent', () => {
  let component: WhitelistedUsersComponent;
  let fixture: ComponentFixture<WhitelistedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhitelistedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhitelistedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

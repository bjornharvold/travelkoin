import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersByStatusComponent } from './users-by-status.component';

describe('UsersByStatusComponent', () => {
  let component: UsersByStatusComponent;
  let fixture: ComponentFixture<UsersByStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersByStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

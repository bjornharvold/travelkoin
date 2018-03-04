import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureTimerComponent } from './secure-timer.component';

describe('SecureTimerComponent', () => {
  let component: SecureTimerComponent;
  let fixture: ComponentFixture<SecureTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecureTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecureTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

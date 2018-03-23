import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFinishedComponent } from './airdrop.component';

describe('EventFinishedComponent', () => {
  let component: EventFinishedComponent;
  let fixture: ComponentFixture<EventFinishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventFinishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

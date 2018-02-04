import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HansComponent } from './hans.component';

describe('HansComponent', () => {
  let component: HansComponent;
  let fixture: ComponentFixture<HansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

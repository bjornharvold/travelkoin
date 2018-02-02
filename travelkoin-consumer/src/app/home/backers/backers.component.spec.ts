import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackersComponent } from './backers.component';

describe('BackersComponent', () => {
  let component: BackersComponent;
  let fixture: ComponentFixture<BackersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChromeBrowserRequiredComponent } from './chrome-browser-required.component';

describe('ChromeBrowserRequiredComponent', () => {
  let component: ChromeBrowserRequiredComponent;
  let fixture: ComponentFixture<ChromeBrowserRequiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChromeBrowserRequiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChromeBrowserRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

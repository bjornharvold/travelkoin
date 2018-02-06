import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcoDetailsComponent } from './ico-details.component';

describe('IcoDetailsComponent', () => {
  let component: IcoDetailsComponent;
  let fixture: ComponentFixture<IcoDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcoDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

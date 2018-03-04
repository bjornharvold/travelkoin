import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingProviderComponent } from './missing-provider.component';

describe('MissingProviderComponent', () => {
  let component: MissingProviderComponent;
  let fixture: ComponentFixture<MissingProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

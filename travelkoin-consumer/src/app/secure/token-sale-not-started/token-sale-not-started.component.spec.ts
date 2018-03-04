import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenSaleNotStartedComponent } from './token-sale-not-started.component';

describe('TokenSaleNotStartedComponent', () => {
  let component: TokenSaleNotStartedComponent;
  let fixture: ComponentFixture<TokenSaleNotStartedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenSaleNotStartedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenSaleNotStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenSaleEndedComponent } from './token-sale-ended.component';

describe('TokenSaleEndedComponent', () => {
  let component: TokenSaleEndedComponent;
  let fixture: ComponentFixture<TokenSaleEndedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenSaleEndedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenSaleEndedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

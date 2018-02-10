import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TokenWalletComponent} from './token-wallet.component';

describe('TokenWalletComponent', () => {
    let component: TokenWalletComponent;
    let fixture: ComponentFixture<TokenWalletComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TokenWalletComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TokenWalletComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

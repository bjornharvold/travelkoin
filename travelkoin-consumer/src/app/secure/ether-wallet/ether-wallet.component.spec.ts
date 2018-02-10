import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EtherWalletComponent} from './ether-wallet.component';

describe('EtherWalletComponent', () => {
    let component: EtherWalletComponent;
    let fixture: ComponentFixture<EtherWalletComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EtherWalletComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EtherWalletComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

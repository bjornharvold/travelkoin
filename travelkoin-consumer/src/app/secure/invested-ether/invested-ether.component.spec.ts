import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InvestedEtherComponent} from './invested-ether.component';

describe('InvestedEtherComponent', () => {
    let component: InvestedEtherComponent;
    let fixture: ComponentFixture<InvestedEtherComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InvestedEtherComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InvestedEtherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

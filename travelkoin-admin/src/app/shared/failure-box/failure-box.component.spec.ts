/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FailureBoxComponent} from './failure-box.component';

describe('FailureBoxComponent', () => {
    let component: FailureBoxComponent;
    let fixture: ComponentFixture<FailureBoxComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FailureBoxComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FailureBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});

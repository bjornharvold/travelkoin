/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MultimediaDivComponent} from './multimedia-div.component';

describe('MultimediaDivComponent', () => {
    let component: MultimediaDivComponent;
    let fixture: ComponentFixture<MultimediaDivComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MultimediaDivComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultimediaDivComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});

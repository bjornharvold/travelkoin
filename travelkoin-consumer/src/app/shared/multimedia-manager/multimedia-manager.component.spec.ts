/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MultimediaManagerComponent} from './multimedia-manager.component';

describe('MultimediaManagerComponent', () => {
    let component: MultimediaManagerComponent;
    let fixture: ComponentFixture<MultimediaManagerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MultimediaManagerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultimediaManagerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});

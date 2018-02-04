/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthenticatedGuard} from '../core/authenticated.guard';
import {HansComponent} from './hans/hans.component';
import {AdminGuard} from '../core/admin.guard';

const routes: Routes = [
    {
        path: '',
        component: HansComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canLoad: [AuthenticatedGuard, AdminGuard],
                canActivate: [AuthenticatedGuard, AdminGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class HansRoutingModule {
}

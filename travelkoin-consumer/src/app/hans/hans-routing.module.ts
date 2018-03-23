/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthenticatedGuard} from '../core/authenticated.guard';
import {HansComponent} from './hans/hans.component';
import {HansGuard} from '../core/hans.guard';
import {UsersComponent} from './users/users.component';

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
                canLoad: [AuthenticatedGuard, HansGuard],
                canActivate: [AuthenticatedGuard, HansGuard]
            },
            {
                path: 'users',
                component: UsersComponent,
                canLoad: [AuthenticatedGuard, HansGuard],
                canActivate: [AuthenticatedGuard, HansGuard]
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

/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SecureComponent} from './secure/secure.component';
import {RegisteredGuard} from '../core/registered.guard';
import {AuthenticatedGuard} from '../core/authenticated.guard';
import {FormsComponent} from './forms/forms.component';
import {SmartContractComponent} from './smart-contract/smart-contract.component';

const routes: Routes = [
    {
        path: '',
        component: SecureComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canLoad: [AuthenticatedGuard, RegisteredGuard],
                canActivate: [AuthenticatedGuard, RegisteredGuard]
            },
            {
                path: 'contract',
                component: SmartContractComponent,
                canLoad: [AuthenticatedGuard, RegisteredGuard],
                canActivate: [AuthenticatedGuard, RegisteredGuard]
            },
            {
                path: 'forms',
                component: FormsComponent,
                canLoad: [AuthenticatedGuard],
                canActivate: [AuthenticatedGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class SecureRoutingModule {
}

import {NgModule} from '@angular/core';
import {HansComponent} from './hans/hans.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HansRoutingModule} from './hans-routing.module';
import {SharedModule} from '../shared/shared.module';
import {NavigationComponent} from './navigation/navigation.component';
import {UsersComponent} from './users/users.component';
import {RegisteredUsersComponent} from './registered-users/registered-users.component';
import {ApprovedUsersComponent} from './approved-users/approved-users.component';
import {WaitingForApprovalUsersComponent} from './waiting-for-approval-users/waiting-for-approval-users.component';
import {BlockedUsersComponent} from './blocked-users/blocked-users.component';
import { SmartContractConfigurationComponent } from './smart-contract-configuration/smart-contract-configuration.component';
import { SmartContractDateTimeComponent } from './smart-contract-date-time/smart-contract-date-time.component';
import { SmartContractWhitelistComponent } from './smart-contract-whitelist/smart-contract-whitelist.component';

@NgModule({
    imports: [
        SharedModule,
        HansRoutingModule
    ],
    declarations: [
        HansComponent,
        DashboardComponent,
        NavigationComponent,
        UsersComponent,
        RegisteredUsersComponent,
        ApprovedUsersComponent,
        WaitingForApprovalUsersComponent,
        BlockedUsersComponent,
        SmartContractConfigurationComponent,
        SmartContractDateTimeComponent,
        SmartContractWhitelistComponent
    ]
})
export class HansModule {
}

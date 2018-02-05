import {NgModule} from '@angular/core';
import {HansComponent} from './hans/hans.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HansRoutingModule} from './hans-routing.module';
import {SharedModule} from '../shared/shared.module';
import { NavigationComponent } from './navigation/navigation.component';
import { UsersComponent } from './users/users.component';
import { UsersByStatusComponent } from './users-by-status/users-by-status.component';

@NgModule({
    imports: [
        SharedModule,
        HansRoutingModule
    ],
    declarations: [HansComponent, DashboardComponent, NavigationComponent, UsersComponent, UsersByStatusComponent]
})
export class HansModule {
}

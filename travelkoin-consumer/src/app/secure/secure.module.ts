import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SharedModule} from '../shared/shared.module';
import {SecureRoutingModule} from './secure-routing.module';
import {SecureComponent} from './secure/secure.component';
import {FormsComponent} from './forms/forms.component';
import {SecureTimerComponent} from './secure-timer/secure-timer.component';

@NgModule({
    imports: [
        SharedModule,
        SecureRoutingModule
    ],
    declarations: [
        DashboardComponent,
        SecureComponent,
        SecureTimerComponent,
        FormsComponent
    ]
})
export class SecureModule {
}

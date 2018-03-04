import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SharedModule} from '../shared/shared.module';
import {SecureRoutingModule} from './secure-routing.module';
import {NavigationComponent} from './navigation/navigation.component';
import {ProgressComponent} from './progress/progress.component';
import {SecureComponent} from './secure/secure.component';
import {FormsComponent} from './forms/forms.component';
import {TokenSaleComponent} from './token-sale/token-sale.component';
import {TokenWalletComponent} from './token-wallet/token-wallet.component';
import {SmartContractComponent} from './smart-contract/smart-contract.component';
import { TokenSaleEndedComponent } from './token-sale-ended/token-sale-ended.component';
import { UserStatusComponent } from './user-status/user-status.component';
import { TokenSaleNotStartedComponent } from './token-sale-not-started/token-sale-not-started.component';
import { MissingProviderComponent } from './missing-provider/missing-provider.component';
import { NotLoggedInComponent } from './not-logged-in/not-logged-in.component';
import { SecureTimerComponent } from './secure-timer/secure-timer.component';
import { HelpComponent } from './help/help.component';

@NgModule({
    imports: [
        SharedModule,
        SecureRoutingModule
    ],
    declarations: [
        DashboardComponent,
        NavigationComponent,
        ProgressComponent,
        SecureComponent,
        FormsComponent,
        TokenSaleComponent,
        TokenWalletComponent,
        SmartContractComponent,
        TokenSaleEndedComponent,
        UserStatusComponent,
        TokenSaleNotStartedComponent,
        MissingProviderComponent,
        NotLoggedInComponent,
        SecureTimerComponent,
        HelpComponent
    ]
})
export class SecureModule {
}

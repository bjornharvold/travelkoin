import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SharedModule} from '../shared/shared.module';
import {SecureRoutingModule} from './secure-routing.module';
import {NavigationComponent} from './navigation/navigation.component';
import {ProgressComponent} from './progress/progress.component';
import {WalletOverviewComponent} from './wallet-overview/wallet-overview.component';
import {WalletComponent} from './wallet/wallet.component';
import {SecureComponent} from './secure/secure.component';
import {WalletValueComponent} from './wallet-value/wallet-value.component';
import {WalletSendComponent} from './wallet-send/wallet-send.component';
import {TransactionDetailsComponent} from './transaction-details/transaction-details.component';
import {FormsComponent} from './forms/forms.component';
import {TokenContractComponent} from './token-contract/token-contract.component';

@NgModule({
    imports: [
        SharedModule,
        SecureRoutingModule
    ],
    declarations: [
        DashboardComponent,
        NavigationComponent,
        ProgressComponent,
        WalletOverviewComponent,
        WalletComponent,
        SecureComponent,
        WalletValueComponent,
        WalletSendComponent,
        TransactionDetailsComponent,
        FormsComponent,
        TokenContractComponent
    ]
})
export class SecureModule {
}

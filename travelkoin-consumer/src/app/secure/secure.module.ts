import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SharedModule} from '../shared/shared.module';
import {SecureRoutingModule} from './secure-routing.module';
import {NavigationComponent} from './navigation/navigation.component';
import {ProgressComponent} from './progress/progress.component';
import {InvestedEtherComponent} from './invested-ether/invested-ether.component';
import {EtherWalletComponent} from './ether-wallet/ether-wallet.component';
import {SecureComponent} from './secure/secure.component';
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
        InvestedEtherComponent,
        EtherWalletComponent,
        SecureComponent,
        TransactionDetailsComponent,
        FormsComponent,
        TokenContractComponent
    ]
})
export class SecureModule {
}

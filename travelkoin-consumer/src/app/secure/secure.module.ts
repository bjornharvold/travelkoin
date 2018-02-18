import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SharedModule} from '../shared/shared.module';
import {SecureRoutingModule} from './secure-routing.module';
import {NavigationComponent} from './navigation/navigation.component';
import {ProgressComponent} from './progress/progress.component';
import {SecureComponent} from './secure/secure.component';
import {TransactionDetailsComponent} from './transaction-details/transaction-details.component';
import {FormsComponent} from './forms/forms.component';
import {TokenSaleComponent} from './token-sale/token-sale.component';
import {TokenWalletComponent} from './token-wallet/token-wallet.component';
import {SmartContractComponent} from './smart-contract/smart-contract.component';

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
        TransactionDetailsComponent,
        FormsComponent,
        TokenSaleComponent,
        TokenWalletComponent,
        SmartContractComponent
    ]
})
export class SecureModule {
}

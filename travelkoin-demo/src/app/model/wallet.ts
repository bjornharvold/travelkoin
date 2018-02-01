import {WalletType} from './wallet-type.enum';

export interface Wallet {
    walletType: WalletType;
    walletBalance: number;
    walletTotalTransactions: number;
}

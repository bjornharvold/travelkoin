import {WalletType} from './wallet-type.enum';
import {WalletTransaction} from './wallet-transaction';

export interface WalletTransactions {
    type: WalletType;
    txs: Array<WalletTransaction>;
    balance: number;
}

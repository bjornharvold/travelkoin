import {WalletTransactions} from './wallet-transactions';
import {WalletType} from './wallet-type.enum';
import {BitcoinTransaction} from './bitcoin-transaction';

export class BitcoinTransactions implements WalletTransactions {
    get balance(): number {
        let result = 0;

        if (this.txs != null && this.txs.length > 0) {
            for (const tx of this.txs) {
                result += tx.credit;
            }
        }

        return result;
    }

    constructor(public type: WalletType, public txs: Array<BitcoinTransaction>) {
    }
}

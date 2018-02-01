import {TransactionInputEntry} from './transaction-input-entry';

export class BitcoinTransactionInputEntry implements TransactionInputEntry {
    txid: string;
    script: string;
    n: string;
    hash: string;
    value: string;

    static deserializeObject(obj: any): BitcoinTransactionInputEntry {
        const result: BitcoinTransactionInputEntry = new BitcoinTransactionInputEntry();

        if (obj != null) {
            if (obj.txid != null) {
                result.txid = obj.txid;
            }
            if (obj.n != null) {
                result.n = obj.n;
            }
            if (obj.hash != null) {
                result.hash = obj.hash;
            }
            if (obj.value != null) {
                result.value = obj.value;
            }

            if (obj.script != null) {
                result.script = obj.script;
            }
        }

        return result;
    }

    constructor() {
    }
}

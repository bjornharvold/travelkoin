import {ScriptPubKey} from './script-pub-key';
import {TransactionOutputEntry} from './transaction-output-entry';

export class BitcoinTransactionOutputEntry implements TransactionOutputEntry {
    value: string;
    n: number;
    scriptPubKey: ScriptPubKey;
    spentTxId: string;
    spendIndex: number;
    spendHeight: number;

    static deserializeObject(obj: any): BitcoinTransactionOutputEntry {
        const result: BitcoinTransactionOutputEntry = new BitcoinTransactionOutputEntry();

        if (obj != null) {
            if (obj.value != null) {
                result.value = obj.value;
            }
            if (obj.n != null) {
                result.n = obj.n;
            }
            if (obj.scriptPubKey != null) {
                result.scriptPubKey = ScriptPubKey.deserializeScriptPubKey(obj.scriptPubKey);
            }
            if (obj.spentTxId != null) {
                result.spentTxId = obj.spentTxId;
            }
            if (obj.spendIndex != null) {
                result.spendIndex = obj.spendIndex;
            }
            if (obj.spendHeight != null) {
                result.spendHeight = obj.spendHeight;
            }
        }

        return result;
    }

    constructor() {
    }
}

import {ScriptPubKey} from './script-pub-key';

export interface TransactionOutputEntry {
    value: string;
    n: number;
    scriptPubKey: ScriptPubKey;
    spentTxId: string;
    spendIndex: number;
    spendHeight: number;
}

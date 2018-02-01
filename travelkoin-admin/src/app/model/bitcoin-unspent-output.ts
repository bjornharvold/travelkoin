import {WalletUnspentOutput} from './wallet-unspent-output';

export class BitcoinUnspentOutput implements WalletUnspentOutput {
    address: string;
    txid: string;
    vout: number;
    ts: number;
    scriptPubKey: string;
    amount: number;
    confirmation: number;
    confirmationsFromCache: boolean;

    static deserializeObject(obj: BitcoinUnspentOutput): BitcoinUnspentOutput {
        const result: BitcoinUnspentOutput = new BitcoinUnspentOutput();

        if (obj != null) {
            if (obj.address != null) {
                result.address = obj.address;
            }
            if (obj.txid != null) {
                result.txid = obj.txid;
            }
            if (obj.vout != null) {
                result.vout = obj.vout;
            }
            if (obj.ts != null) {
                result.ts = obj.ts;
            }
            if (obj.scriptPubKey != null) {
                result.scriptPubKey = obj.scriptPubKey;
            }
            if (obj.amount != null) {
                result.amount = obj.amount;
            }
            if (obj.confirmation != null) {
                result.confirmation = obj.confirmation;
            }
            if (obj.confirmationsFromCache != null) {
                result.confirmationsFromCache = obj.confirmationsFromCache;
            }
        }

        return result;
    }

    static deserializeObjects(ary: Array<BitcoinUnspentOutput>): Array<BitcoinUnspentOutput> {
        const result: Array<BitcoinUnspentOutput> = [];

        if (ary != null && ary.length > 0) {
            for (let utxo of ary) {
                result.push(BitcoinUnspentOutput.deserializeObject(utxo));
            }
        }

        return result;
    }
}

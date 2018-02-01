import {WalletTransaction} from './wallet-transaction';
import {BitcoinTransactionInputEntry} from './bitcoin-transaction-input-entry';
import {BitcoinTransactionOutputEntry} from './bitcoin-transaction-output-entry';

export class BitcoinTransaction implements WalletTransaction {
    txid: string;
    version: number;
    locktime: string;
    blockhash: string;
    blockheight: number;
    confirmations: number;
    time: number;
    blocktime: number;
    valueOut: number;
    size: number;
    valueIn: number;
    fees: number;
    vin: Array<BitcoinTransactionInputEntry>;
    vout: Array<BitcoinTransactionOutputEntry>;

    static deserializeObject(publicKey: string, obj: BitcoinTransaction): BitcoinTransaction {
        const result: BitcoinTransaction = new BitcoinTransaction(publicKey);

        if (obj != null) {
            if (obj.txid != null) {
                result.txid = obj.txid;
            }
            if (obj.version != null) {
                result.version = obj.version;
            }
            if (obj.locktime != null) {
                result.locktime = obj.locktime;
            }
            if (obj.blockhash != null) {
                result.blockhash = obj.blockhash;
            }
            if (obj.blockheight != null) {
                result.blockheight = obj.blockheight;
            }
            if (obj.confirmations != null) {
                result.confirmations = obj.confirmations;
            }
            if (obj.time != null) {
                result.time = obj.time;
            }
            if (obj.blocktime != null) {
                result.blocktime = obj.blocktime;
            }
            if (obj.valueOut != null) {
                result.valueOut = obj.valueOut;
            }
            if (obj.size != null) {
                result.size = obj.size;
            }
            if (obj.valueIn != null) {
                result.valueIn = obj.valueIn;
            }
            if (obj.fees != null) {
                result.fees = obj.fees;
            }
            if (obj.vin != null && obj.vin.length > 0) {
                result.vin = [];
                for (let input of obj.vin) {
                    result.vin.push(BitcoinTransactionInputEntry.deserializeObject(input));
                }
            }
            if (obj.vout != null && obj.vout.length > 0) {
                result.vout = [];
                for (let output of obj.vout) {
                    result.vout.push(BitcoinTransactionOutputEntry.deserializeObject(output));
                }
            }
        }

        return result;
    }

    get credit(): number {
        let result = 0;
        if (this.confirmations > 4 && this.vout != null && this.vout.length > 0) {
            for (let op of this.vout) {
                if (op.scriptPubKey != null) {
                    if (op.scriptPubKey.addresses != null && op.scriptPubKey.addresses.length > 0) {
                        for (let addie of op.scriptPubKey.addresses) {
                            if (addie === this.publicKey) {
                                result += +op.value;
                            }
                        }
                    }
                }
            }
        }

        return result;
    }

    constructor(private publicKey: string) {

    }
}

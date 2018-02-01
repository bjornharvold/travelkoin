import {WalletTransaction} from './wallet-transaction';
import {EthereumTransactionResult} from './ethereum-transaction-result';

const GWEI: number = 1000000000000000000;

export class EthereumTransaction implements WalletTransaction {
    id: number;
    jsonrpc: string;
    result: EthereumTransactionResult;

    static deserializeObject(publicKey: string, obj: EthereumTransaction): EthereumTransaction {
        const result: EthereumTransaction = new EthereumTransaction(publicKey);

        if (obj != null) {
            if (obj.id != null) {
                result.id = obj.id;
            }
            if (obj.jsonrpc != null) {
                result.jsonrpc = obj.jsonrpc;
            }
            if (obj.result != null) {
                result.result = EthereumTransactionResult.deserializeObject(obj.result);
            }
        }

        return result;
    }

    get txid(): string {
        let result = '';

        if (this.result != null) {
            result = this.result.hash;
        }
        return result;
    }

    get time(): number {
        return 0;
    }

    get confirmations(): number {
        return 0;
    }

    get fees(): number {
        let result = 0;

        if (this.result != null) {
            result = parseInt(this.result.gas, 16) * parseInt(this.result.gasPrice, 16);
        }
        return result;
    }

    get credit(): number {
        let result = 0;

        if (this.result != null) {
            if (this.result.to === this.publicKey) {
                result = parseInt(this.result.value, 16) / GWEI;
            }
        }
        return result;
    }

    constructor(private publicKey: string) {

    }
}

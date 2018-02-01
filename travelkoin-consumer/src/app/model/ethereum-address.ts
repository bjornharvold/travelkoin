import {Wallet} from './wallet';
import {WalletType} from './wallet-type.enum';

const GWEI: number = 1000000000000000000;
export class EthereumAddress implements Wallet {
    id: number;
    jsonrpc: string;
    result: string;

    static deserializeObject(obj: EthereumAddress): EthereumAddress {
        const result: EthereumAddress = new EthereumAddress();

        if (obj != null) {
            if (obj.id != null) {
                result.id = obj.id;
            }
            if (obj.jsonrpc != null) {
                result.jsonrpc = obj.jsonrpc;
            }
            if (obj.result != null) {
                result.result = obj.result;
            }
        }

        return result;
    }

    get walletType(): WalletType {
        return WalletType.ETH;
    }

    get walletBalance(): number {
        return parseInt(this.result, 16) / GWEI;
    }

    get walletTotalTransactions(): number {
        return 0;
    }
}

import {Wallet} from './wallet';
import {WalletType} from './wallet-type.enum';

export class BitcoinAddress implements Wallet {
    addrStr: string;
    balance: number;
    balanceSat: number;
    totalReceived: number;
    totalReceivedSat: number;
    totalSent: number;
    totalSentSat: number;
    unconfirmedBalance: number;
    unconfirmedBalanceSat: number;
    unconfirmedTxApperances: number;
    txApperances: number;
    transactions: Array<string>;

    static deserializeObject(obj: BitcoinAddress): BitcoinAddress {
        const result: BitcoinAddress = new BitcoinAddress();

        if (obj != null) {
            if (obj.addrStr != null) {
                result.addrStr = obj.addrStr;
            }
            if (obj.balance != null) {
                result.balance = obj.balance;
            }
            if (obj.balanceSat != null) {
                result.balanceSat = obj.balanceSat;
            }
            if (obj.totalReceived != null) {
                result.totalReceived = obj.totalReceived;
            }
            if (obj.totalReceivedSat != null) {
                result.totalReceivedSat = obj.totalReceivedSat;
            }
            if (obj.totalSent != null) {
                result.totalSent = obj.totalSent;
            }
            if (obj.totalSentSat != null) {
                result.totalSentSat = obj.totalSentSat;
            }
            if (obj.unconfirmedBalance != null) {
                result.unconfirmedBalance = obj.unconfirmedBalance;
            }
            if (obj.unconfirmedBalanceSat != null) {
                result.unconfirmedBalanceSat = obj.unconfirmedBalanceSat;
            }
            if (obj.unconfirmedTxApperances != null) {
                result.unconfirmedTxApperances = obj.unconfirmedTxApperances;
            }
            if (obj.txApperances != null) {
                result.txApperances = obj.txApperances;
            }
            if (obj.transactions != null) {
                result.transactions = obj.transactions;
            }
        }

        return result;
    }

    get walletType(): WalletType {
        return WalletType.BTC;
    }

    get walletBalance(): number {
        return this.balance;
    }

    get walletTotalTransactions(): number {
        return this.txApperances;
    }
}

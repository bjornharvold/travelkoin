import {Injectable} from '@angular/core';
import {ECPair, Network, networks} from 'bitcoinjs-lib'
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import {Wallet} from '../model/wallet';
import {BitcoinAddress} from '../model/bitcoin-address';
import {WalletUnspentOutput} from '../model/wallet-unspent-output';
import {BitcoinUnspentOutput} from '../model/bitcoin-unspent-output';
import {MiningFee} from '../model/mining-fee';
import {Transaction} from '../model/transaction';
import {BitcoinTransaction} from '../model/bitcoin-transaction';

const MINING_FEE_ENDPOINT = 'https://bitcoinfees.21.co/api/v1/fees/recommended';
const TESTNET_ENDPOINT = 'https://testnet.blockexplorer.com/api';
const LIVE_ENDPOINT = 'https://blockexplorer.com/api';

@Injectable()
export class BitcoinService {
    private endpoint: string;
    private network: Network;

    // private createTransaction(wif: string): Transaction {
    //     const key: ECPair = ECPair.fromWIF(wif, this.network);
    //
    //     const tx: TransactionBuilder = new TransactionBuilder(this.network);
    //
    // }

    createKey(): ECPair {
        return ECPair.makeRandom({network: this.network});
    }

    loadMiningFee(): Observable<MiningFee> {
        return this.httpClient.get<MiningFee>(MINING_FEE_ENDPOINT);
    }

    loadUnspentOutputs(publicKey: string): Observable<Array<WalletUnspentOutput>> {
        return this.httpClient.get<Array<BitcoinUnspentOutput>>(`${this.endpoint}/addrs/${publicKey}/utxo`)
            .map((result: Array<BitcoinUnspentOutput>) => BitcoinUnspentOutput.deserializeObjects(result));
    }

    loadTransaction(tx: Transaction): Observable<BitcoinTransaction | null> {
        let result: Observable<BitcoinTransaction>;

        if (tx != null) {
            result = this.httpClient.get<BitcoinTransaction>(`${this.endpoint}/tx/${tx.transactionID}`)
                .map((result: BitcoinTransaction) => BitcoinTransaction.deserializeObject(tx.recipient, result));
        } else {
            result = Observable.of(null);
        }

        return result;
    }

    loadTransactions(txs: Array<Transaction>): Observable<Array<BitcoinTransaction> | null> {
        let result: Observable<Array<BitcoinTransaction>>;

        if (txs != null && txs.length > 0) {
            const ary: Array<Observable<BitcoinTransaction>> = [];
            for (let tx of txs) {
                ary.push(this.httpClient.get<BitcoinTransaction>(`${this.endpoint}/tx/${tx.transactionID}`)
                    .map((result: BitcoinTransaction) => BitcoinTransaction.deserializeObject(tx.recipient, result)));
            }
            result = Observable.zip(...ary);
        } else {
            result = Observable.of(null);
        }

        return result;
    }

    loadAddress(publicKey: string): Observable<Wallet> {
        return this.httpClient.get<BitcoinAddress>(`${this.endpoint}/addr/${publicKey}`)
            .map((result: BitcoinAddress) => BitcoinAddress.deserializeObject(result));
    }

    constructor(private httpClient: HttpClient) {
        if (environment.production) {
            this.network = networks.testnet; // later change this to the bitcoin network when everything works and for prod only
            this.endpoint = LIVE_ENDPOINT;
        } else {
            this.network = networks.testnet;
            this.endpoint = TESTNET_ENDPOINT;
        }
    }

}

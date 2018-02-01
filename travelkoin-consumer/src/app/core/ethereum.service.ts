import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Wallet} from '../model/wallet';
import {EthereumAddress} from '../model/ethereum-address';
import {Transaction} from '../model/transaction';
import {EthereumTransaction} from '../model/ethereum-transaction';

const ENDPOINT = 'https://api.infura.io/v1/jsonrpc/';
const TESTNET = 'rinkeby';
const LIVE = 'mainnet';

@Injectable()
export class EthereumService {
    private endpoint: string;

    loadAddress(publicKey: string): Observable<Wallet> {
        const params: HttpParams = new HttpParams().set('params', `["${publicKey}", "latest"]`);
        return this.httpClient.get<any>(`${this.endpoint}/eth_getBalance`, {params: params})
            .map((result: any) => EthereumAddress.deserializeObject(result));
    }

    loadTransaction(tx: Transaction): Observable<EthereumTransaction | null> {
        let result: Observable<EthereumTransaction>;

        if (tx != null) {
            const params: HttpParams = new HttpParams().set('params', `["${tx.transactionID}"]`);
            result = this.httpClient.get<EthereumTransaction>(`${this.endpoint}/eth_getTransactionByHash`, {params: params})
                .map((result: EthereumTransaction) => EthereumTransaction.deserializeObject(tx.recipient, result));
        } else {
            result = Observable.of(null);
        }

        return result;
    }

    loadTransactions(txs: Array<Transaction>): Observable<Array<EthereumTransaction> | null> {
        let result: Observable<Array<EthereumTransaction>>;

        if (txs != null && txs.length > 0) {
            const ary: Array<Observable<EthereumTransaction>> = [];
            for (let tx of txs) {
                const params: HttpParams = new HttpParams().set('params', `["${tx.transactionID}"]`);
                ary.push(this.httpClient.get<EthereumTransaction>(`${this.endpoint}/eth_getTransactionByHash`, {params: params})
                    .map((result: EthereumTransaction) => EthereumTransaction.deserializeObject(tx.recipient, result)));
            }
            result = Observable.zip(...ary);
        } else {
            result = Observable.of(null);
        }

        return result;
    }

    constructor(private httpClient: HttpClient) {
        if (environment.production) {
            this.endpoint = ENDPOINT + LIVE;
        } else {
            this.endpoint = ENDPOINT + TESTNET;
        }
    }

}

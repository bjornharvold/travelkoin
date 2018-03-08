
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from 'soltsice';

/**
 * CappedCrowdsale API
 */
export class CappedCrowdsale extends SoltsiceContract {
    public static get artifacts() { return require('../contracts/CappedCrowdsale.json'); }

    public static get bytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = CappedCrowdsale.artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    public static async new(deploymentParams: W3.TX.TxParams, ctorParams?: {_cap: BigNumber | number}, w3?: W3, link?: SoltsiceContract[], privateKey?: string): Promise<CappedCrowdsale> {
        w3 = w3 || W3.default;
        if (!privateKey) {
            let contract = new CappedCrowdsale(deploymentParams, ctorParams, w3, link);
            await contract._instancePromise;
            return contract;
        } else {
            let data = CappedCrowdsale.newData(ctorParams, w3);
            let txHash = await w3.sendSignedTransaction(W3.zeroAddress, privateKey, data, deploymentParams);
            let txReceipt = await w3.waitTransactionReceipt(txHash);
            let rawAddress = txReceipt.contractAddress;
            let contract = await CappedCrowdsale.at(rawAddress, w3);
            return contract;
        }
    }

    public static async at(address: string | object, w3?: W3): Promise<CappedCrowdsale> {
        let contract = new CappedCrowdsale(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    public static async deployed(w3?: W3): Promise<CappedCrowdsale> {
        let contract = new CappedCrowdsale('', undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    // tslint:disable-next-line:max-line-length
    public static newData(ctorParams?: {_cap: BigNumber | number}, w3?: W3): string {
        // tslint:disable-next-line:max-line-length
        let data = SoltsiceContract.newDataImpl(w3, CappedCrowdsale.artifacts, ctorParams ? [ctorParams!._cap] : []);
        return data;
    }

    protected constructor(
        deploymentParams: string | W3.TX.TxParams | object,
        ctorParams?: {_cap: BigNumber | number},
        w3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            w3,
            CappedCrowdsale.artifacts,
            ctorParams ? [ctorParams!._cap] : [],
            deploymentParams,
            link
        );
    }
    /*
        Contract methods
    */
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public rate( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.rate
                .call( txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public cap( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.cap
                .call( txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public weiRaised( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.weiRaised
                .call( txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public wallet( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.wallet
                .call( txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public buyTokens = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_beneficiary: string, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.buyTokens(_beneficiary, txParams || this._sendParams)
                        .then((res: any) => resolve(res))
                        .catch((err: any) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.buyTokens.request(_beneficiary).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_beneficiary: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.buyTokens.sendTransaction(_beneficiary, txParams || this._sendParams)
                            .then((res: any) => resolve(res))
                            .catch((err: any) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_beneficiary: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.buyTokens.request(_beneficiary).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_beneficiary: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.buyTokens.request(_beneficiary).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_beneficiary: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.buyTokens.estimateGas(_beneficiary).then((g: any) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public token( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.token
                .call( txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public capReached( txParams?: W3.TX.TxParams): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.capReached
                .call( txParams || this._sendParams)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
        });
    }
    
}

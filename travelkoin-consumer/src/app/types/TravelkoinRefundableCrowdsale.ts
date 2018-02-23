
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from 'soltsice';

/**
 * TravelkoinRefundableCrowdsale API
 */
export class TravelkoinRefundableCrowdsale extends SoltsiceContract {
    public static get Artifacts() { return require('../contracts/TravelkoinRefundableCrowdsale.json'); }

    public static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = TravelkoinRefundableCrowdsale.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    public static async New(deploymentParams: W3.TX.TxParams, ctorParams?: {_goal: BigNumber | number}, w3?: W3, link?: SoltsiceContract[], privateKey?: string): Promise<TravelkoinRefundableCrowdsale> {
        w3 = w3 || W3.Default;
        if (!privateKey) {
            let contract = new TravelkoinRefundableCrowdsale(deploymentParams, ctorParams, w3, link);
            await contract._instancePromise;
            return contract;
        } else {
            let data = TravelkoinRefundableCrowdsale.NewData(ctorParams, w3);
            let txHash = await w3.sendSignedTransaction(W3.zeroAddress, privateKey, data, deploymentParams);
            let txReceipt = await w3.waitTransactionReceipt(txHash);
            let rawAddress = txReceipt.contractAddress;
            let contract = await TravelkoinRefundableCrowdsale.At(rawAddress, w3);
            return contract;
        }
    }

    public static async At(address: string | object, w3?: W3): Promise<TravelkoinRefundableCrowdsale> {
        let contract = new TravelkoinRefundableCrowdsale(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    public static async Deployed(w3?: W3): Promise<TravelkoinRefundableCrowdsale> {
        let contract = new TravelkoinRefundableCrowdsale('', undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    // tslint:disable-next-line:max-line-length
    public static NewData(ctorParams?: {_goal: BigNumber | number}, w3?: W3): string {
        // tslint:disable-next-line:max-line-length
        let data = SoltsiceContract.NewDataImpl(w3, TravelkoinRefundableCrowdsale.Artifacts, ctorParams ? [ctorParams!._goal] : []);
        return data;
    }

    protected constructor(
        deploymentParams: string | W3.TX.TxParams | object,
        ctorParams?: {_goal: BigNumber | number},
        w3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            w3,
            TravelkoinRefundableCrowdsale.Artifacts,
            ctorParams ? [ctorParams!._goal] : [],
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
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public endTime( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.endTime
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public goal( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.goal
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public weiRaised( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.weiRaised
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public hasStarted( txParams?: W3.TX.TxParams): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.hasStarted
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public finalize = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        ( txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.finalize( txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.finalize.request().params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign(( txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.finalize.sendTransaction( txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: ( privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.finalize.request().params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.finalize.request().params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.finalize.estimateGas().then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public wallet( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.wallet
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public startTime( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.startTime
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public isFinalized( txParams?: W3.TX.TxParams): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.isFinalized
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public owner( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.owner
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public valueOfNow( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.valueOfNow
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public buyTokens = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (beneficiary: string, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.buyTokens(beneficiary, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.buyTokens.request(beneficiary).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((beneficiary: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.buyTokens.sendTransaction(beneficiary, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (beneficiary: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.buyTokens.request(beneficiary).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (beneficiary: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.buyTokens.request(beneficiary).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (beneficiary: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.buyTokens.estimateGas(beneficiary).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public hasEnded( txParams?: W3.TX.TxParams): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.hasEnded
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public transferOwnership = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (newOwner: string, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.transferOwnership(newOwner, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.transferOwnership.request(newOwner).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((newOwner: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.transferOwnership.sendTransaction(newOwner, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (newOwner: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.transferOwnership.request(newOwner).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (newOwner: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.transferOwnership.request(newOwner).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (newOwner: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.transferOwnership.estimateGas(newOwner).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public vault( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.vault
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public token( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.token
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public claimRefund = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        ( txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.claimRefund( txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.claimRefund.request().params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign(( txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.claimRefund.sendTransaction( txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: ( privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.claimRefund.request().params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.claimRefund.request().params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.claimRefund.estimateGas().then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public goalReached( txParams?: W3.TX.TxParams): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.goalReached
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
}

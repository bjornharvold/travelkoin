
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from 'soltsice';

/**
 * TravelkoinController API
 */
export class TravelkoinController extends SoltsiceContract {
    static get Artifacts() { return require('../contracts/TravelkoinController.json'); }

    static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = TravelkoinController.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    static async New(deploymentParams: W3.TX.TxParams, ctorParams?: {_wallet: string}, w3?: W3, link?: SoltsiceContract[]): Promise<TravelkoinController> {
        let contract = new TravelkoinController(deploymentParams, ctorParams, w3, link);
        await contract._instancePromise;
        return contract;
    }

    static async At(address: string | object, w3?: W3): Promise<TravelkoinController> {
        let contract = new TravelkoinController(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    static async Deployed(w3?: W3): Promise<TravelkoinController> {
        let contract = new TravelkoinController('', undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    protected constructor(
        deploymentParams: string | W3.TX.TxParams | object,
        ctorParams?: {_wallet: string},
        w3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            w3,
            TravelkoinController.Artifacts,
            ctorParams ? [ctorParams!._wallet] : [],
            deploymentParams,
            link
        );
    }
    /*
        Contract methods
    */
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public TOKEN_HODL_6M( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.TOKEN_HODL_6M
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public TOKEN_EARLY_CONTRIBUTORS( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.TOKEN_EARLY_CONTRIBUTORS
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public TOKEN_SALE2( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.TOKEN_SALE2
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public TOKEN_HODL_9M( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.TOKEN_HODL_9M
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public TOKEN_BOUNTY( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.TOKEN_BOUNTY
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public MILLION( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.MILLION
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public newController( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.newController
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public hodler( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.hodler
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public unpause = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        ( txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.unpause( txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign(( txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.unpause.sendTransaction( txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: ( privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.unpause.request().params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.unpause.request().params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.unpause.estimateGas().then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public VESTING_ADVISOR_DURATION( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.VESTING_ADVISOR_DURATION
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public multiSigWallet( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.multiSigWallet
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public VESTING_ADVISOR_CLIFF( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.VESTING_ADVISOR_CLIFF
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public SALE( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.SALE
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public VESTING_TEAM_CLIFF( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.VESTING_TEAM_CLIFF
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public paused( txParams?: W3.TX.TxParams): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.paused
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public TOKEN_FOUNDERS( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.TOKEN_FOUNDERS
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public CONTRIBUTOR1( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.CONTRIBUTOR1
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public tokenGrants(_0: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.tokenGrants
                .call(_0, txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public TOKEN_SALE1_NORMAL( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.TOKEN_SALE1_NORMAL
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public pause = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        ( txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.pause( txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign(( txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.pause.sendTransaction( txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: ( privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.pause.request().params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.pause.request().params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.pause.estimateGas().then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public THOUSAND( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.THOUSAND
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public TOKEN_TEAM( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.TOKEN_TEAM
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
    public crowdsale( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.crowdsale
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public FOUNDER2( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.FOUNDER2
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public VESTING_TEAM_DURATION( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.VESTING_TEAM_DURATION
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public TOKEN_COMMUNITY( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.TOKEN_COMMUNITY
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public FOUNDER1( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.FOUNDER1
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public CONTRIBUTOR2( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.CONTRIBUTOR2
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public transferOwnership = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (newOwner: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.transferOwnership(newOwner, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
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
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.transferOwnership.request(newOwner).params[0].data, txParams, nonce);
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
    public TKT_UNIT( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.TKT_UNIT
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public TOKEN_HODL_3M( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.TOKEN_HODL_3M
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
    public extractTokens = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_token: string, _claimer: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.extractTokens(_token, _claimer, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_token: string, _claimer: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.extractTokens.sendTransaction(_token, _claimer, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_token: string, _claimer: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.extractTokens.request(_token, _claimer).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_token: string, _claimer: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.extractTokens.request(_token, _claimer).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_token: string, _claimer: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.extractTokens.estimateGas(_token, _claimer).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public setCrowdsaleTransfer = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_sale: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.setCrowdsaleTransfer(_sale, _amount, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_sale: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.setCrowdsaleTransfer.sendTransaction(_sale, _amount, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_sale: string, _amount: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.setCrowdsaleTransfer.request(_sale, _amount).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_sale: string, _amount: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.setCrowdsaleTransfer.request(_sale, _amount).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_sale: string, _amount: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.setCrowdsaleTransfer.estimateGas(_sale, _amount).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public isCrowdsaleOpen( txParams?: W3.TX.TxParams): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.isCrowdsaleOpen
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public createGrant = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_beneficiary: string, _start: BigNumber | number, _amount: BigNumber | number, _revocable: boolean, _advisor: boolean, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.createGrant(_beneficiary, _start, _amount, _revocable, _advisor, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_beneficiary: string, _start: BigNumber | number, _amount: BigNumber | number, _revocable: boolean, _advisor: boolean, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.createGrant.sendTransaction(_beneficiary, _start, _amount, _revocable, _advisor, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_beneficiary: string, _start: BigNumber | number, _amount: BigNumber | number, _revocable: boolean, _advisor: boolean, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.createGrant.request(_beneficiary, _start, _amount, _revocable, _advisor).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_beneficiary: string, _start: BigNumber | number, _amount: BigNumber | number, _revocable: boolean, _advisor: boolean): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.createGrant.request(_beneficiary, _start, _amount, _revocable, _advisor).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_beneficiary: string, _start: BigNumber | number, _amount: BigNumber | number, _revocable: boolean, _advisor: boolean): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.createGrant.estimateGas(_beneficiary, _start, _amount, _revocable, _advisor).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public transferToGrant = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_id: BigNumber | number, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.transferToGrant(_id, _amount, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_id: BigNumber | number, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.transferToGrant.sendTransaction(_id, _amount, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_id: BigNumber | number, _amount: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.transferToGrant.request(_id, _amount).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_id: BigNumber | number, _amount: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.transferToGrant.request(_id, _amount).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_id: BigNumber | number, _amount: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.transferToGrant.estimateGas(_id, _amount).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public revokeGrant = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_id: BigNumber | number, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.revokeGrant(_id, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_id: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.revokeGrant.sendTransaction(_id, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_id: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.revokeGrant.request(_id).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_id: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.revokeGrant.request(_id).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_id: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.revokeGrant.estimateGas(_id).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public getGrantCount( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.getGrantCount
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public burn = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_where: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.burn(_where, _amount, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_where: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.burn.sendTransaction(_where, _amount, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_where: string, _amount: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.burn.request(_where, _amount).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_where: string, _amount: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.burn.request(_where, _amount).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_where: string, _amount: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.burn.estimateGas(_where, _amount).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public setNewController = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_controller: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.setNewController(_controller, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_controller: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.setNewController.sendTransaction(_controller, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_controller: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.setNewController.request(_controller).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_controller: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.setNewController.request(_controller).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_controller: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.setNewController.estimateGas(_controller).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public setNewMultisig = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_wallet: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.setNewMultisig(_wallet, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_wallet: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.setNewMultisig.sendTransaction(_wallet, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_wallet: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.setNewMultisig.request(_wallet).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_wallet: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.setNewMultisig.request(_wallet).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_wallet: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.setNewMultisig.estimateGas(_wallet).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public setToken = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_token: string, _hodler: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.setToken(_token, _hodler, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_token: string, _hodler: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.setToken.sendTransaction(_token, _hodler, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_token: string, _hodler: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.setToken.request(_token, _hodler).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_token: string, _hodler: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.setToken.request(_token, _hodler).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_token: string, _hodler: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.setToken.estimateGas(_token, _hodler).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public setHodlerTime = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_time: BigNumber | number, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.setHodlerTime(_time, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_time: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.setHodlerTime.sendTransaction(_time, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_time: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.setHodlerTime.request(_time).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_time: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.setHodlerTime.request(_time).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_time: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.setHodlerTime.estimateGas(_time).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public addHodlerStake = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_beneficiary: string, _stake: BigNumber | number, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.addHodlerStake(_beneficiary, _stake, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_beneficiary: string, _stake: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.addHodlerStake.sendTransaction(_beneficiary, _stake, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_beneficiary: string, _stake: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.addHodlerStake.request(_beneficiary, _stake).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_beneficiary: string, _stake: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.addHodlerStake.request(_beneficiary, _stake).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_beneficiary: string, _stake: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.addHodlerStake.estimateGas(_beneficiary, _stake).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public setHodlerStake = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_beneficiary: string, _stake: BigNumber | number, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.setHodlerStake(_beneficiary, _stake, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_beneficiary: string, _stake: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.setHodlerStake.sendTransaction(_beneficiary, _stake, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_beneficiary: string, _stake: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.setHodlerStake.request(_beneficiary, _stake).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_beneficiary: string, _stake: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.setHodlerStake.request(_beneficiary, _stake).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_beneficiary: string, _stake: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.setHodlerStake.estimateGas(_beneficiary, _stake).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public proxyPayment = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_owner: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.proxyPayment(_owner, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_owner: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.proxyPayment.sendTransaction(_owner, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_owner: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.proxyPayment.request(_owner).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_owner: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.proxyPayment.request(_owner).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_owner: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.proxyPayment.estimateGas(_owner).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public onTransfer = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_from: string, _to: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.onTransfer(_from, _to, _amount, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_from: string, _to: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.onTransfer.sendTransaction(_from, _to, _amount, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_from: string, _to: string, _amount: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.onTransfer.request(_from, _to, _amount).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_from: string, _to: string, _amount: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.onTransfer.request(_from, _to, _amount).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_from: string, _to: string, _amount: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.onTransfer.estimateGas(_from, _to, _amount).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public onApprove = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_owner: string, _spender: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.onApprove(_owner, _spender, _amount, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_owner: string, _spender: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.onApprove.sendTransaction(_owner, _spender, _amount, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_owner: string, _spender: string, _amount: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.onApprove.request(_owner, _spender, _amount).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_owner: string, _spender: string, _amount: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.onApprove.request(_owner, _spender, _amount).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_owner: string, _spender: string, _amount: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.onApprove.estimateGas(_owner, _spender, _amount).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public claimTokenTokens = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_token: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.claimTokenTokens(_token, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_token: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.claimTokenTokens.sendTransaction(_token, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_token: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.claimTokenTokens.request(_token).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_token: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.claimTokenTokens.request(_token).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_token: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.claimTokenTokens.estimateGas(_token).then((g) => resolve(g));
                });
            }
        });
    
}

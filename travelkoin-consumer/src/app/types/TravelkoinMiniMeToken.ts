
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from 'soltsice';

/**
 * TravelkoinMiniMeToken API
 */
export class TravelkoinMiniMeToken extends SoltsiceContract {
    public static get Artifacts() { return require('../contracts/TravelkoinMiniMeToken.json'); }

    public static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = TravelkoinMiniMeToken.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    public static async New(deploymentParams: W3.TX.TxParams, ctorParams?: {_controller: string, _tokenFactory: string}, w3?: W3, link?: SoltsiceContract[], privateKey?: string): Promise<TravelkoinMiniMeToken> {
        w3 = w3 || W3.Default;
        if (!privateKey) {
            let contract = new TravelkoinMiniMeToken(deploymentParams, ctorParams, w3, link);
            await contract._instancePromise;
            return contract;
        } else {
            let data = TravelkoinMiniMeToken.NewData(ctorParams, w3);
            let txHash = await w3.sendSignedTransaction(W3.zeroAddress, privateKey, data, deploymentParams);
            let txReceipt = await w3.waitTransactionReceipt(txHash);
            let rawAddress = txReceipt.contractAddress;
            let contract = await TravelkoinMiniMeToken.At(rawAddress, w3);
            return contract;
        }
    }

    public static async At(address: string | object, w3?: W3): Promise<TravelkoinMiniMeToken> {
        let contract = new TravelkoinMiniMeToken(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    public static async Deployed(w3?: W3): Promise<TravelkoinMiniMeToken> {
        let contract = new TravelkoinMiniMeToken('', undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    // tslint:disable-next-line:max-line-length
    public static NewData(ctorParams?: {_controller: string, _tokenFactory: string}, w3?: W3): string {
        // tslint:disable-next-line:max-line-length
        let data = SoltsiceContract.NewDataImpl(w3, TravelkoinMiniMeToken.Artifacts, ctorParams ? [ctorParams!._controller, ctorParams!._tokenFactory] : []);
        return data;
    }

    protected constructor(
        deploymentParams: string | W3.TX.TxParams | object,
        ctorParams?: {_controller: string, _tokenFactory: string},
        w3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            w3,
            TravelkoinMiniMeToken.Artifacts,
            ctorParams ? [ctorParams!._controller, ctorParams!._tokenFactory] : [],
            deploymentParams,
            link
        );
    }
    /*
        Contract methods
    */
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public name( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.name
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public approve = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_spender: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.approve(_spender, _amount, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.approve.request(_spender, _amount).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_spender: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.approve.sendTransaction(_spender, _amount, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_spender: string, _amount: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.approve.request(_spender, _amount).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_spender: string, _amount: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.approve.request(_spender, _amount).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_spender: string, _amount: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.approve.estimateGas(_spender, _amount).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public creationBlock( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.creationBlock
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public totalSupply( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.totalSupply
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public transferFrom = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_from: string, _to: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.transferFrom(_from, _to, _amount, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.transferFrom.request(_from, _to, _amount).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_from: string, _to: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.transferFrom.sendTransaction(_from, _to, _amount, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_from: string, _to: string, _amount: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.transferFrom.request(_from, _to, _amount).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_from: string, _to: string, _amount: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.transferFrom.request(_from, _to, _amount).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_from: string, _to: string, _amount: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.transferFrom.estimateGas(_from, _to, _amount).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public decimals( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.decimals
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public changeController = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_newController: string, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.changeController(_newController, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.changeController.request(_newController).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_newController: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.changeController.sendTransaction(_newController, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_newController: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.changeController.request(_newController).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_newController: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.changeController.request(_newController).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_newController: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.changeController.estimateGas(_newController).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public balanceOfAt(_owner: string, _blockNumber: BigNumber | number, txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.balanceOfAt
                .call(_owner, _blockNumber, txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public version( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.version
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public createCloneToken = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_cloneTokenName: string, _cloneDecimalUnits: BigNumber | number, _cloneTokenSymbol: string, _snapshotBlock: BigNumber | number, _transfersEnabled: boolean, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.createCloneToken(_cloneTokenName, _cloneDecimalUnits, _cloneTokenSymbol, _snapshotBlock, _transfersEnabled, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.createCloneToken.request(_cloneTokenName, _cloneDecimalUnits, _cloneTokenSymbol, _snapshotBlock, _transfersEnabled).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_cloneTokenName: string, _cloneDecimalUnits: BigNumber | number, _cloneTokenSymbol: string, _snapshotBlock: BigNumber | number, _transfersEnabled: boolean, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.createCloneToken.sendTransaction(_cloneTokenName, _cloneDecimalUnits, _cloneTokenSymbol, _snapshotBlock, _transfersEnabled, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_cloneTokenName: string, _cloneDecimalUnits: BigNumber | number, _cloneTokenSymbol: string, _snapshotBlock: BigNumber | number, _transfersEnabled: boolean, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.createCloneToken.request(_cloneTokenName, _cloneDecimalUnits, _cloneTokenSymbol, _snapshotBlock, _transfersEnabled).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_cloneTokenName: string, _cloneDecimalUnits: BigNumber | number, _cloneTokenSymbol: string, _snapshotBlock: BigNumber | number, _transfersEnabled: boolean): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.createCloneToken.request(_cloneTokenName, _cloneDecimalUnits, _cloneTokenSymbol, _snapshotBlock, _transfersEnabled).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_cloneTokenName: string, _cloneDecimalUnits: BigNumber | number, _cloneTokenSymbol: string, _snapshotBlock: BigNumber | number, _transfersEnabled: boolean): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.createCloneToken.estimateGas(_cloneTokenName, _cloneDecimalUnits, _cloneTokenSymbol, _snapshotBlock, _transfersEnabled).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public balanceOf(_owner: string, txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.balanceOf
                .call(_owner, txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public parentToken( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.parentToken
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public generateTokens = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_owner: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.generateTokens(_owner, _amount, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.generateTokens.request(_owner, _amount).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_owner: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.generateTokens.sendTransaction(_owner, _amount, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_owner: string, _amount: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.generateTokens.request(_owner, _amount).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_owner: string, _amount: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.generateTokens.request(_owner, _amount).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_owner: string, _amount: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.generateTokens.estimateGas(_owner, _amount).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public symbol( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.symbol
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public totalSupplyAt(_blockNumber: BigNumber | number, txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.totalSupplyAt
                .call(_blockNumber, txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public transfer = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_to: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.transfer(_to, _amount, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.transfer.request(_to, _amount).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_to: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.transfer.sendTransaction(_to, _amount, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_to: string, _amount: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.transfer.request(_to, _amount).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_to: string, _amount: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.transfer.request(_to, _amount).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_to: string, _amount: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.transfer.estimateGas(_to, _amount).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public transfersEnabled( txParams?: W3.TX.TxParams): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._instance.transfersEnabled
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public parentSnapShotBlock( txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.parentSnapShotBlock
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public approveAndCall = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_spender: string, _amount: BigNumber | number, _extraData: string, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.approveAndCall(_spender, _amount, _extraData, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.approveAndCall.request(_spender, _amount, _extraData).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_spender: string, _amount: BigNumber | number, _extraData: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.approveAndCall.sendTransaction(_spender, _amount, _extraData, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_spender: string, _amount: BigNumber | number, _extraData: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.approveAndCall.request(_spender, _amount, _extraData).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_spender: string, _amount: BigNumber | number, _extraData: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.approveAndCall.request(_spender, _amount, _extraData).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_spender: string, _amount: BigNumber | number, _extraData: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.approveAndCall.estimateGas(_spender, _amount, _extraData).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:member-ordering
    public destroyTokens = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_owner: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.destroyTokens(_owner, _amount, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.destroyTokens.request(_owner, _amount).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_owner: string, _amount: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.destroyTokens.sendTransaction(_owner, _amount, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_owner: string, _amount: BigNumber | number, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.destroyTokens.request(_owner, _amount).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_owner: string, _amount: BigNumber | number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.destroyTokens.request(_owner, _amount).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_owner: string, _amount: BigNumber | number): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.destroyTokens.estimateGas(_owner, _amount).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public allowance(_owner: string, _spender: string, txParams?: W3.TX.TxParams): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this._instance.allowance
                .call(_owner, _spender, txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public claimTokens = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_token: string, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.claimTokens(_token, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.claimTokens.request(_token).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_token: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.claimTokens.sendTransaction(_token, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_token: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.claimTokens.request(_token).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_token: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.claimTokens.request(_token).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_token: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.claimTokens.estimateGas(_token).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public tokenFactory( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.tokenFactory
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
    // tslint:disable-next-line:member-ordering
    public enableTransfers = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_transfersEnabled: boolean, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.enableTransfers(_transfersEnabled, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.enableTransfers.request(_transfersEnabled).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_transfersEnabled: boolean, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.enableTransfers.sendTransaction(_transfersEnabled, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_transfersEnabled: boolean, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.enableTransfers.request(_transfersEnabled).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_transfersEnabled: boolean): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.enableTransfers.request(_transfersEnabled).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_transfersEnabled: boolean): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.enableTransfers.estimateGas(_transfersEnabled).then((g) => resolve(g));
                });
            }
        });
    
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    public controller( txParams?: W3.TX.TxParams): Promise<string> {
        return new Promise((resolve, reject) => {
            this._instance.controller
                .call( txParams || this._sendParams)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }
    
}

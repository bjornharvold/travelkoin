
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from 'soltsice';

/**
 * MiniMeTokenFactory API
 */
export class MiniMeTokenFactory extends SoltsiceContract {
    public static get Artifacts() { return require('../contracts/MiniMeTokenFactory.json'); }

    public static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = MiniMeTokenFactory.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    public static async New(deploymentParams: W3.TX.TxParams, ctorParams?: {}, w3?: W3, link?: SoltsiceContract[], privateKey?: string): Promise<MiniMeTokenFactory> {
        w3 = w3 || W3.Default;
        if (!privateKey) {
            let contract = new MiniMeTokenFactory(deploymentParams, ctorParams, w3, link);
            await contract._instancePromise;
            return contract;
        } else {
            let data = MiniMeTokenFactory.NewData(ctorParams, w3);
            let txHash = await w3.sendSignedTransaction(W3.zeroAddress, privateKey, data, deploymentParams);
            let txReceipt = await w3.waitTransactionReceipt(txHash);
            let rawAddress = txReceipt.contractAddress;
            let contract = await MiniMeTokenFactory.At(rawAddress, w3);
            return contract;
        }
    }

    public static async At(address: string | object, w3?: W3): Promise<MiniMeTokenFactory> {
        let contract = new MiniMeTokenFactory(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    public static async Deployed(w3?: W3): Promise<MiniMeTokenFactory> {
        let contract = new MiniMeTokenFactory('', undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    // tslint:disable-next-line:max-line-length
    public static NewData(ctorParams?: {}, w3?: W3): string {
        // tslint:disable-next-line:max-line-length
        let data = SoltsiceContract.NewDataImpl(w3, MiniMeTokenFactory.Artifacts, ctorParams ? [] : []);
        return data;
    }

    protected constructor(
        deploymentParams: string | W3.TX.TxParams | object,
        ctorParams?: {},
        w3?: W3,
        link?: SoltsiceContract[]
    ) {
        // tslint:disable-next-line:max-line-length
        super(
            w3,
            MiniMeTokenFactory.Artifacts,
            ctorParams ? [] : [],
            deploymentParams,
            link
        );
    }
    /*
        Contract methods
    */
    
    // tslint:disable-next-line:member-ordering
    public createCloneToken = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (_parentToken: string, _snapshotBlock: BigNumber | number, _tokenName: string, _decimalUnits: BigNumber | number, _tokenSymbol: string, _transfersEnabled: boolean, txParams?: W3.TX.TxParams, privateKey?: string): Promise<W3.TX.TransactionResult> => {
            if (!privateKey) {
                return new Promise((resolve, reject) => {
                    this._instance.createCloneToken(_parentToken, _snapshotBlock, _tokenName, _decimalUnits, _tokenSymbol, _transfersEnabled, txParams || this._sendParams)
                        .then((res) => resolve(res))
                        .catch((err) => reject(err));
                });
            } else {
                // tslint:disable-next-line:max-line-length
                return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.createCloneToken.request(_parentToken, _snapshotBlock, _tokenName, _decimalUnits, _tokenSymbol, _transfersEnabled).params[0].data, txParams || this._sendParams, undefined)
                    .then(txHash => {
                        return this.waitTransactionReceipt(txHash);
                    });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((_parentToken: string, _snapshotBlock: BigNumber | number, _tokenName: string, _decimalUnits: BigNumber | number, _tokenSymbol: string, _transfersEnabled: boolean, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.createCloneToken.sendTransaction(_parentToken, _snapshotBlock, _tokenName, _decimalUnits, _tokenSymbol, _transfersEnabled, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (_parentToken: string, _snapshotBlock: BigNumber | number, _tokenName: string, _decimalUnits: BigNumber | number, _tokenSymbol: string, _transfersEnabled: boolean, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.createCloneToken.request(_parentToken, _snapshotBlock, _tokenName, _decimalUnits, _tokenSymbol, _transfersEnabled).params[0].data, txParams || this._sendParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (_parentToken: string, _snapshotBlock: BigNumber | number, _tokenName: string, _decimalUnits: BigNumber | number, _tokenSymbol: string, _transfersEnabled: boolean): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.createCloneToken.request(_parentToken, _snapshotBlock, _tokenName, _decimalUnits, _tokenSymbol, _transfersEnabled).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (_parentToken: string, _snapshotBlock: BigNumber | number, _tokenName: string, _decimalUnits: BigNumber | number, _tokenSymbol: string, _transfersEnabled: boolean): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.createCloneToken.estimateGas(_parentToken, _snapshotBlock, _tokenName, _decimalUnits, _tokenSymbol, _transfersEnabled).then((g) => resolve(g));
                });
            }
        });
    
}

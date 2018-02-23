
import { W3, SoltsiceContract } from 'soltsice';

/**
 * Controlled API
 */
export class Controlled extends SoltsiceContract {
    public static get Artifacts() { return require('../contracts/Controlled.json'); }

    public static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = Controlled.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    public static async New(deploymentParams: W3.TX.TxParams, ctorParams?: {}, w3?: W3, link?: SoltsiceContract[], privateKey?: string): Promise<Controlled> {
        w3 = w3 || W3.Default;
        if (!privateKey) {
            let contract = new Controlled(deploymentParams, ctorParams, w3, link);
            await contract._instancePromise;
            return contract;
        } else {
            let data = Controlled.NewData(ctorParams, w3);
            let txHash = await w3.sendSignedTransaction(W3.zeroAddress, privateKey, data, deploymentParams);
            let txReceipt = await w3.waitTransactionReceipt(txHash);
            let rawAddress = txReceipt.contractAddress;
            let contract = await Controlled.At(rawAddress, w3);
            return contract;
        }
    }

    public static async At(address: string | object, w3?: W3): Promise<Controlled> {
        let contract = new Controlled(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    public static async Deployed(w3?: W3): Promise<Controlled> {
        let contract = new Controlled('', undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    // tslint:disable-next-line:max-line-length
    public static NewData(ctorParams?: {}, w3?: W3): string {
        // tslint:disable-next-line:max-line-length
        let data = SoltsiceContract.NewDataImpl(w3, Controlled.Artifacts, ctorParams ? [] : []);
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
            Controlled.Artifacts,
            ctorParams ? [] : [],
            deploymentParams,
            link
        );
    }
    /*
        Contract methods
    */
    
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
    
}

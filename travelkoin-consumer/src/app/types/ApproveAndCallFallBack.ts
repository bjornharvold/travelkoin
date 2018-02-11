
import { BigNumber } from 'bignumber.js';
import { W3, SoltsiceContract } from 'soltsice';

/**
 * ApproveAndCallFallBack API
 */
export class ApproveAndCallFallBack extends SoltsiceContract {
    static get Artifacts() { return require('../contracts/ApproveAndCallFallBack.json'); }

    static get BytecodeHash() {
        // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
        let artifacts = ApproveAndCallFallBack.Artifacts;
        if (!artifacts || !artifacts.bytecode) {
            return undefined;
        }
        let hash = W3.sha3(JSON.stringify(artifacts.bytecode));
        return hash;
    }

    // tslint:disable-next-line:max-line-length
    static async New(deploymentParams: W3.TX.TxParams, ctorParams?: {}, w3?: W3, link?: SoltsiceContract[]): Promise<ApproveAndCallFallBack> {
        let contract = new ApproveAndCallFallBack(deploymentParams, ctorParams, w3, link);
        await contract._instancePromise;
        return contract;
    }

    static async At(address: string | object, w3?: W3): Promise<ApproveAndCallFallBack> {
        let contract = new ApproveAndCallFallBack(address, undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
    }

    static async Deployed(w3?: W3): Promise<ApproveAndCallFallBack> {
        let contract = new ApproveAndCallFallBack('', undefined, w3, undefined);
        await contract._instancePromise;
        return contract;
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
            ApproveAndCallFallBack.Artifacts,
            ctorParams ? [] : [],
            deploymentParams,
            link
        );
    }
    /*
        Contract methods
    */
    
    // tslint:disable-next-line:member-ordering
    public receiveApproval = Object.assign(
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:variable-name
        (from: string, _amount: BigNumber | number, _token: string, _data: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
            return new Promise((resolve, reject) => {
                this._instance.receiveApproval(from, _amount, _token, _data, txParams || this._sendParams)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            sendTransaction: Object.assign((from: string, _amount: BigNumber | number, _token: string, _data: string, txParams?: W3.TX.TxParams): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        this._instance.receiveApproval.sendTransaction(from, _amount, _token, _data, txParams || this._sendParams)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                    });
                },
                {
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:variable-name
                    sendSigned: (from: string, _amount: BigNumber | number, _token: string, _data: string, privateKey: string, txParams?: W3.TX.TxParams, nonce?: number): Promise<string> => {
                        // tslint:disable-next-line:max-line-length
                        return this.w3.sendSignedTransaction(this.address, privateKey, this._instance.receiveApproval.request(from, _amount, _token, _data).params[0].data, txParams, nonce);
                    }
                }
            )
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            data: (from: string, _amount: BigNumber | number, _token: string, _data: string): Promise<string> => {
                return new Promise((resolve, reject) => {
                    resolve(this._instance.receiveApproval.request(from, _amount, _token, _data).params[0].data);
                });
            }
        },
        {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:variable-name
            estimateGas: (from: string, _amount: BigNumber | number, _token: string, _data: string): Promise<number> => {
                return new Promise((resolve, reject) => {
                    this._instance.receiveApproval.estimateGas(from, _amount, _token, _data).then((g) => resolve(g));
                });
            }
        });
    
}

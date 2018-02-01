export interface WalletUnspentOutput {
    address: string,
    txid: string,
    vout: number,
    ts: number,
    scriptPubKey: string,
    amount: number,
    confirmation: number,
    confirmationsFromCache: boolean
}

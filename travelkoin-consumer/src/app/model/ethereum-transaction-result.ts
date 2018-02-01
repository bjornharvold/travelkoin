export class EthereumTransactionResult {
    hash: string;
    nonce: string;
    blockHash: string;
    blockNumber: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    input: string;

    static deserializeObject(obj: EthereumTransactionResult): EthereumTransactionResult {
        const result: EthereumTransactionResult = new EthereumTransactionResult();

        if (obj != null) {
            if (obj.hash != null) {
                result.hash = obj.hash;
            }
            if (obj.nonce != null) {
                result.nonce = obj.nonce;
            }
            if (obj.blockHash != null) {
                result.blockHash = obj.blockHash;
            }
            if (obj.blockNumber != null) {
                result.blockNumber = obj.blockNumber;
            }
            if (obj.transactionIndex != null) {
                result.transactionIndex = obj.transactionIndex;
            }
            if (obj.from != null) {
                result.from = obj.from;
            }
            if (obj.to != null) {
                result.to = obj.to;
            }
            if (obj.value != null) {
                result.value = obj.value;
            }
            if (obj.gas != null) {
                result.gas = obj.gas;
            }
            if (obj.gasPrice != null) {
                result.gasPrice = obj.gasPrice;
            }
            if (obj.input != null) {
                result.input = obj.input;
            }
        }

        return result;
    }
}

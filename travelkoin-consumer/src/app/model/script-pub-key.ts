export class ScriptPubKey {
    asm: string;
    hex: string;
    addresses: Array<string>;
    type: string;

    static deserializeScriptPubKey(obj: any): ScriptPubKey {
        const result: ScriptPubKey = new ScriptPubKey();

        if (obj != null) {
            if (obj.asm != null) {
                result.asm = obj.asm;
            }
            if (obj.hex != null) {
                result.hex = obj.hex;
            }
            if (obj.addresses != null) {
                result.addresses = obj.addresses;
            }
            if (obj.type != null) {
                result.type = obj.type;
            }
        }

        return result;
    }

    constructor() {
    }
}

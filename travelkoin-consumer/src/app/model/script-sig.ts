export class ScriptSig {
    asm: string;
    hex: string;

    static deserializeScriptSig(obj: any): ScriptSig {
        const result: ScriptSig = new ScriptSig();

        if (obj != null) {
            if (obj.asm != null) {
                result.asm = obj.asm;
            }
            if (obj.hex != null) {
                result.hex = obj.hex;
            }
        }

        return result;
    }

    constructor() {
    }
}

import {typecode, ok, code_illegal, code_length_illegal} from "./constants";
// 解析用户第一次发送的数据
export
function rsvdt_first(data:Buffer) : symbol {
    for (const fn of prechecks) {
        const s = fn(data);
        if (s !== ok) {
            return s
        }
    }
    return ok;
}


const prechecks : Array<Function> = [code_existence]
const allows : Array<number> = []

for (const types of typecode.types) {
    if (types.name === 'player') {
        for (const p of types.codes) {
            allows.push(p.code)
        }
    }
}

// 检验发来的code是否合法
function code_existence(data) : Symbol{
    if (data.length != 4) return code_length_illegal;
    const code: number = data.readInt32LE(0)
    // 检查发来的code是否属于能够在 typecode 中找到
    return allows.indexOf(code) != -1 ? ok : code_illegal;
}
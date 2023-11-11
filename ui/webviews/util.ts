export let vs: { postMessage: (_: any) => any }
export let extUri = ''
export let vscCfg: any

export function onInit(vscode: { postMessage: (_: any) => any }, baseUri: string, vscCfgSettings: object) {
    [vs, vscCfg, extUri] = [vscode, vscCfgSettings, baseUri]
    while (extUri.endsWith('/'))
        extUri = extUri.substring(0, extUri.length - 1)
}

export function codiconCss(name: string) {
    return `background-image: url('${codiconPath(name)}')`
}

export function codiconPath(name: string) {
    return extUri + '/node_modules/@vscode/codicons/src/icons/' + name + '.svg'
}

export function alert(msg: string) {
    vs.postMessage({ ident: 'alert', payload: msg })
}

export function dictMap<TIn, TOut>(to: (_: TIn) => TOut, ...dicts: { [_: string]: TIn }[]) {
    const ret: { [_: string]: TOut } = {}
    for (const dict of dicts)
        for (const key in dict)
            ret[key] = to(dict[key])
    return ret
}

export function dictToArr<TArr, TDict>(dict: { [_: string]: TDict } | undefined, to: ((k: string, v: TDict) => TArr)): TArr[] {
    const ret: TArr[] = []
    if (dict)
        for (const key in dict)
            ret.push(to(key, dict[key]))
    return ret
}

export function dictFromArr<TArr, TDict>(arr: TArr[] | undefined, to: (_: TArr) => [string, TDict]): { [_: string]: TDict } {
    const ret: { [_: string]: TDict } = {}
    if (arr)
        for (const item of arr) {
            const tup = to(item)
            ret[tup[0]] = tup[1]
        }
    return ret
}

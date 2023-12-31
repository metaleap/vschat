import van from './vanjs/van-1.2.6.js'
import * as util from './util.js'

const htm = van.tags


export async function onInit(vscode: { postMessage: (_: any) => any }, extUri: string, vscCfgSettings: object) {
    util.onInit(vscode, extUri, vscCfgSettings)

    van.add(document.body, htm.b({}, "Hello ", htm.i({}, " World")))

    window.addEventListener('message', onMessage)
}

function onMessage(evt: MessageEvent) {
    const msg = evt.data
    switch (msg.ident) {
        default:
            util.vs.postMessage({ 'unknown_msg': msg })
            break
    }
}

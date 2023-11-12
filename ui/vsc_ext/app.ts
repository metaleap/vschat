import * as vs from 'vscode'
import * as util from './util'
import * as sidebar from './treeview'
import { VsChatWebViewProvider } from './webview'


let webviewProvider: VsChatWebViewProvider


export async function activate(context: vs.ExtensionContext) {
	util.onInit(context)

	util.regDisp(vs.window.registerWebviewViewProvider('vsChatWebView', webviewProvider = new VsChatWebViewProvider()))
	await sidebar.onInit()

	webviewProvider.webView?.show(true)
	vs.commands.executeCommand('vsChatTreeView.focus')
}

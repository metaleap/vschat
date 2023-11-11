import * as vs from 'vscode'
import * as utils from './utils'
import * as sidebar from './treeview'

import fetch from 'node-fetch'


export function activate(context: vs.ExtensionContext) {
	utils.onInit(context)

	utils.disp(vs.commands.registerCommand('vsChat.menu', cmdMainMenu))
	sidebar.onInit()

	vs.commands.executeCommand('vsChatTreeView.focus')
}

function cmdMainMenu() {
	let itemConfig: vs.QuickPickItem = { label: "Config...", iconPath: new vs.ThemeIcon('tools'), alwaysShow: true }
	let items: vs.QuickPickItem[] = [itemConfig]

	vs.window.showQuickPick(items, { title: "vsChat" }).then((item) => {
		switch (item) {
			case itemConfig:
				sidebar.showWebview()
				break
		}
	})
}

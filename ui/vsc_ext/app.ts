import * as vs from 'vscode'
import * as util from './util'
import * as sidebar from './treeview'


export function activate(context: vs.ExtensionContext) {
	util.onInit(context)

	util.disp(vs.commands.registerCommand('vsChat.menu', cmdMainMenu))
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

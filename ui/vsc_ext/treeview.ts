import * as vs from 'vscode'
import * as utils from './utils'
import * as app from './app'


import { VsChatWebViewProvider } from './webview'
let webviewProvider: VsChatWebViewProvider


export abstract class TreeDataProvider implements vs.TreeDataProvider<vs.TreeItem> {
    refreshEmitter = new vs.EventEmitter<vs.TreeItem | undefined | null | void>()
    onDidChangeTreeData = this.refreshEmitter.event
    treeView: vs.TreeView<vs.TreeItem>
    origTitle: string
    abstract getTreeItem(treeNode: vs.TreeItem): vs.TreeItem;
    abstract getChildren(treeNode?: vs.TreeItem): vs.ProviderResult<vs.TreeItem[]>;
    onInit(treeView: vs.TreeView<vs.TreeItem>) {
        utils.disp(this.refreshEmitter)
        this.origTitle = treeView.title ?? '?!bug?!'
        this.treeView = treeView
        return this.treeView
    }
    refreshTitle() {
        this.treeView.title = this.origTitle + " (?)"
    }
}
import { TreeServers as TreeServers } from './treeview_servers'
export let treeServers = new TreeServers()


export function onInit() {
    utils.disp(vs.window.registerWebviewViewProvider('vsChatWebView', webviewProvider = new VsChatWebViewProvider()))
    utils.disp(treeServers.onInit(vs.window.createTreeView('vsChatTreeView', { treeDataProvider: treeServers, showCollapseAll: true })))
}

export function treeNodeCat(treeNode: vs.TreeItem): string {
    const idx = (treeNode.id as string).indexOf(':') as number
    return (treeNode.id as string).substring(0, idx)
}

export function showWebview() {
    webviewProvider.webView?.show(true)
}

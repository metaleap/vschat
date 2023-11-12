import * as vs from 'vscode'
import * as util from './util'
import * as chat from './chat_providers.js'

export abstract class TreeDataProvider implements vs.TreeDataProvider<vs.TreeItem> {
    refreshEmitter = new vs.EventEmitter<vs.TreeItem | undefined | null | void>()
    onDidChangeTreeData = this.refreshEmitter.event
    treeView: vs.TreeView<vs.TreeItem>
    origTitle: string
    abstract getTreeItem(treeNode: vs.TreeItem): vs.TreeItem;
    abstract getChildren(treeNode?: vs.TreeItem): vs.ProviderResult<vs.TreeItem[]>;
    onInit(treeView: vs.TreeView<vs.TreeItem>) {
        util.regDisp(this.refreshEmitter)
        this.origTitle = treeView.title ?? "bug: put default tree title back into package.json"
        this.treeView = treeView
        return this.treeView
    }
    refreshTitle() {
        this.treeView.title = this.origTitle + " (?)"
    }
}

export class TreeServers extends TreeDataProvider {
    override getTreeItem(treeNode: vs.TreeItem): vs.TreeItem {
        return treeNode
    }

    override getChildren(parentTreeNode?: vs.TreeItem): vs.ProviderResult<vs.TreeItem[]> {
        const ret: vs.TreeItem[] = [{
            collapsibleState: vs.TreeItemCollapsibleState.None,
            iconPath: new vs.ThemeIcon('comment-unresolved'),
            id: "someTreeItem",
            command: { title: 'Command Title', command: 'vsChat.menu', arguments: [] },
            label: "Item Label",
        }]
        return ret
    }
}


export let treeServers = new TreeServers()
export let chatServers: chat.ServerImpl[] = []

export function onInit() {
    chatServers.push(chat.newKaffe())

    util.regDisp(treeServers.onInit(vs.window.createTreeView('vsChatTreeView', { treeDataProvider: treeServers, showCollapseAll: true })))
}

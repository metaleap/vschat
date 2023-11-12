import * as vs from 'vscode'
import * as util from './util'


import { TreeServers as TreeServers } from './treeview_servers'
export let treeServers = new TreeServers()


export function onInit() {
    util.regDisp(treeServers.onInit(vs.window.createTreeView('vsChatTreeView', { treeDataProvider: treeServers, showCollapseAll: true })))
}

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

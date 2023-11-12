import * as vs from 'vscode'
import * as util from './util'
import * as chat from './chat_providers.js'

class TreeItem extends vs.TreeItem {
    server: chat.ServerImpl | null
    channel: chat.ServerChannel | null
}

export abstract class TreeDataProvider implements vs.TreeDataProvider<TreeItem> {
    refreshEmitter = new vs.EventEmitter<TreeItem | undefined | null | void>()
    onDidChangeTreeData = this.refreshEmitter.event
    treeView: vs.TreeView<TreeItem>
    origTitle: string
    abstract getTreeItem(treeNode: TreeItem): TreeItem;
    abstract getChildren(treeNode?: TreeItem): vs.ProviderResult<TreeItem[]>;
    onInit(treeView: vs.TreeView<TreeItem>) {
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
    override getTreeItem(treeNode: TreeItem): TreeItem {
        return treeNode
    }

    override getChildren(parentTreeNode?: TreeItem): vs.ProviderResult<TreeItem[]> {
        if (!parentTreeNode) {
            return chatServers.map(_ => {
                const ret = new TreeItem(_.title, vs.TreeItemCollapsibleState.Expanded)
                ret.id = _.title
                ret.server = _
                ret.iconPath = new vs.ThemeIcon('comment-unresolved')
                return ret
            })
        }
        if (parentTreeNode.channel)
            return []

        return parentTreeNode.server!.channels.map(_ => {
            const ret = new TreeItem(_.title, vs.TreeItemCollapsibleState.Expanded)
            ret.server = parentTreeNode.server!
            ret.channel = _
            ret.id = ret.server.title + '_' + _.title
            ret.iconPath = new vs.ThemeIcon('comment')
            return ret
        })
    }
}


export let treeServers = new TreeServers()
export let chatServers: chat.ServerImpl[] = []

export async function onInit() {
    const dummy = await chat.newKaffe()
    dummy.logIn()
    dummy.loadChannelsList()
    chatServers.push(dummy)

    util.regDisp(treeServers.onInit(vs.window.createTreeView('vsChatTreeView', { treeDataProvider: treeServers, showCollapseAll: true })))
}

import * as vs from 'vscode'
import * as sidebar from './treeview'


export class TreeServers extends sidebar.TreeDataProvider {
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

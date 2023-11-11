import * as vs from 'vscode'
import * as utils from './utils'
import * as app from './app'


export abstract class WebviewPanel {
    private readonly viewTypeIdent: string
    private readonly codicon: string
    private webviewPanel: vs.WebviewPanel

    constructor(viewTypeIdent: string, codicon: string) {
        this.viewTypeIdent = viewTypeIdent
        this.codicon = codicon
    }

    title() { return "TitleHere" }
    htmlUri(localUri: vs.Uri) { return (this.webviewPanel as vs.WebviewPanel).webview.asWebviewUri(localUri) }

    onMessage(msg: any) {
        switch (msg.ident) {
            case 'alert':
                utils.alert(msg.payload as string)
                break
            default:
                vs.window.showInformationMessage(JSON.stringify(msg))
        }
    }

    onInit() {
        utils.disp(this.webviewPanel = vs.window.createWebviewPanel(this.viewTypeIdent, this.title(), vs.ViewColumn.One, {
            retainContextWhenHidden: true,
            enableCommandUris: true,
            enableFindWidget: true,
            enableForms: true,
            enableScripts: true,
            localResourceRoots: [utils.extUri, utils.homeDirPath]
        }))
        utils.disp(this.webviewPanel.webview.onDidReceiveMessage((msg) => this.onMessage(msg)))

        this.webviewPanel.webview.html = `<!DOCTYPE html>
                <html><head>
                    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel='stylesheet' type='text/css' href='${this.htmlUri(utils.cssPath('reset'))}'>
                    <link rel='stylesheet' type='text/css' href='${this.htmlUri(utils.cssPath('vscode'))}'>
                    <link rel='stylesheet' type='text/css' href='${this.htmlUri(utils.cssPath('main'))}'>
                </head><body>
                    <script type='module'>
                        import * as main_view from '${this.htmlUri(utils.jsPath('main_' + this.viewTypeIdent))}'
                        main_view.onInit(
                            acquireVsCodeApi(),
                            '${this.htmlUri(utils.extUri).toString()}',
                            ${JSON.stringify(vs.workspace.getConfiguration().get("vsChat"))},
                        )
                    </script>
                </body></html>`
        this.webviewPanel.iconPath = utils.codiconPath(this.codicon)
        utils.disp(this.webviewPanel.onDidDispose(() => {
        }))
    }

}

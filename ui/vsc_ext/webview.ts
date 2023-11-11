import * as vs from 'vscode'
import * as utils from './utils'

export class VsChatWebViewProvider implements vs.WebviewViewProvider {
    webView?: vs.WebviewView

    htmlUri(localUri: vs.Uri) { return this.webView!.webview.asWebviewUri(localUri) }

    resolveWebviewView(webviewView: vs.WebviewView, _: vs.WebviewViewResolveContext<unknown>) {
        this.webView = webviewView
        this.webView.webview.options = {
            enableCommandUris: true,
            enableForms: true,
            enableScripts: true,
            localResourceRoots: [utils.extUri, utils.homeDirPath],
        }
        this.webView.badge = { tooltip: "Badge Tooltip", value: 3 }
        this.webView.description = "My Description"
        this.webView.title = "My Title"

        this.webView.webview.html = `<!DOCTYPE html>
        <html><head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel='stylesheet' type='text/css' href='${this.htmlUri(utils.cssPath('reset'))}'>
            <link rel='stylesheet' type='text/css' href='${this.htmlUri(utils.cssPath('vscode'))}'>
            <link rel='stylesheet' type='text/css' href='${this.htmlUri(utils.cssPath('main'))}'>
        </head><body>
            <script type='module'>
                import * as main_view from '${this.htmlUri(utils.jsPath('main_view'))}'
                main_view.onInit(
                    acquireVsCodeApi(),
                    '${this.htmlUri(utils.extUri).toString()}',
                    ${JSON.stringify(vs.workspace.getConfiguration().get("vsChat"))},
                )
            </script>
        </body></html>`

        utils.disp(webviewView.webview.onDidReceiveMessage((msg) => this.onMessage(msg)))
    }

    onMessage(msg: any) {
        switch (msg.ident) {
            case 'alert':
                utils.alert(msg.payload as string)
                break
            default:
                vs.window.showInformationMessage(JSON.stringify(msg))
        }
    }

}

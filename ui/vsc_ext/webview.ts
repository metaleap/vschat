import * as vs from 'vscode'
import * as util from './util'

export class VsChatWebViewProvider implements vs.WebviewViewProvider {
    webView?: vs.WebviewView

    htmlUri(localUri: vs.Uri) { return this.webView!.webview.asWebviewUri(localUri) }

    resolveWebviewView(webviewView: vs.WebviewView, _: vs.WebviewViewResolveContext<unknown>) {
        this.webView = webviewView
        this.webView.webview.options = {
            enableCommandUris: true,
            enableForms: true,
            enableScripts: true,
            localResourceRoots: [util.extUri, util.homeDirPath],
        }
        this.webView.description = "some.hint.text.com"
        this.webView.title = "vsChat: le Title"
        this.webView.badge = { tooltip: "TODO: not sure where this ever shows up...", value: 3 }

        this.webView.webview.html = `<!DOCTYPE html>
        <html><head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Access-Control-Allow-Origin" content="*">
            <meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline' ${this.webView.webview.cspSource}; img-src * https:; media-src * https:;">
            <link rel='stylesheet' type='text/css' href='${this.htmlUri(util.cssPath('reset'))}'>
            <link rel='stylesheet' type='text/css' href='${this.htmlUri(util.cssPath('vscode'))}'>
            <link rel='stylesheet' type='text/css' href='${this.htmlUri(util.cssPath('main'))}'>
        </head><body>
            <script type='module'>
                import * as main_view from '${this.htmlUri(util.jsPath('main_view'))}'
                main_view.onInit(
                    acquireVsCodeApi(),
                    '${this.htmlUri(util.extUri).toString()}',
                    ${JSON.stringify(vs.workspace.getConfiguration().get("vsChat"))},
                )
            </script>
        </body></html>`

        util.disp(webviewView.webview.onDidReceiveMessage((msg) => this.onMessage(msg)))
    }

    onMessage(msg: any) {
        switch (msg.ident) {
            case 'alert':
                util.alert(msg.payload as string)
                break
            default:
                vs.window.showInformationMessage(JSON.stringify(msg))
        }
    }

}

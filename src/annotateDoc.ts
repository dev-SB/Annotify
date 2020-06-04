import * as path from 'path';
import * as vscode from 'vscode';

export class AnnotateDocEditorProvider implements vscode.CustomTextEditorProvider {
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new AnnotateDocEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(AnnotateDocEditorProvider.viewType, provider);
        return providerRegistration;
    }

    private static readonly viewType = 'annotify.annotateDoc';
    constructor(private readonly context: vscode.ExtensionContext) {}

    public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise < void > {
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = this.getHtmlForWebView(webviewPanel.webview);

        function updateWebView() {
            webviewPanel.webview.postMessage({
                type: 'update',
                text: document.getText(),
            });
        }
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updateWebView();
            }
        });

        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        webviewPanel.webview.onDidReceiveMessage(e => {});
        updateWebView();
    }
    private getHtmlForWebview(webview: vscode.Webview): string {

        const scriptUri = webview.asWebviewUri(vscode.Uri.file(
            path.join(this.context.extensionPath, 'media', 'annotateDoc.js')
        ));
        const styleUri = webview.asWebviewUri(vscode.Uri.file(
            path.join(this.context.extensionPath, 'media', 'annotateDoc.css')
        ));
    }

}
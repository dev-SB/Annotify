import * as path from 'path';
import * as vscode from 'vscode';
import {
    getNonce
} from './util';
import { getHtml } from './annotateDocHtml';

export class AnnotateDocEditorProvider implements vscode.CustomTextEditorProvider {
    // registers the document doc editor
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new AnnotateDocEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(AnnotateDocEditorProvider.viewType, provider);
        return providerRegistration;
    }

    private static readonly viewType = 'annotify.annotateDoc';
    constructor(private readonly context: vscode.ExtensionContext) {}
// specifies html,css,js to be displayed also updates webview on changes in file
    public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise < void > {
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = this.getHtmlForWebView(webviewPanel.webview,document);
// updates the view on changes
        function updateWebView() {
            webviewPanel.webview.postMessage({
                type: 'update',
                text: document.getText(),
            });
        }
        // subscribe to changes
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updateWebView();
            }
        });
// dispose off subscription 
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        webviewPanel.webview.onDidReceiveMessage(e => {});
        updateWebView();
    }
    // returns the webpage to be displayed in webview
    private getHtmlForWebView(webview: vscode.Webview,document:vscode.TextDocument): string {
        // js file
        const scriptUri = webview.asWebviewUri(vscode.Uri.file(
            path.join(this.context.extensionPath, 'media', 'annotateDoc.js')
        ));
        // css file
        const styleUri = webview.asWebviewUri(vscode.Uri.file(
            path.join(this.context.extensionPath, 'media', 'annotateDoc.css')
        ));
        // htmlfile
        const htmlUri=webview.asWebviewUri(vscode.Uri.file(
            path.join(this.context.extensionPath,'media','annotateDoc.html')
        ));
        const nonce = getNonce();

        return getHtml(scriptUri,styleUri,document,nonce);
    }

}
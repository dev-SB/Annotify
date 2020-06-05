// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import {
	getHtml
} from './annotateDocHtml';

import {
	getNonce
} from './util';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "annotify" is now active!');
	let disposable =
		vscode.commands.registerCommand('annotify.annotateDoc', () => {
			const webViewPanel = vscode.window.createWebviewPanel(
				'annotateDoc',
				'Create Annotations',
				vscode.ViewColumn.One, {}
			);
			// todo: handle when no document is open.
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let doc = editor.document.uri;
				const scriptUri = webViewPanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media', 'annotateDoc.js')));

				const styleUri = webViewPanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media', 'annotateDoc.css')));
				const nonce = getNonce();
				
				webViewPanel.webview.html = getHtml(scriptUri, styleUri, doc, nonce);
			}
		});
	context.subscriptions.push(disposable);
	// context.subscriptions.push(AnnotateDocEditorProvider.register(context));
}

// this method is called when your extension is deactivated
export function deactivate() {}
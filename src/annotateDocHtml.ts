import * as vscode from 'vscode';
export function getHtml(scriptUri: vscode.Uri, styleUri: vscode.Uri,document:vscode.TextDocument,nonce:string):string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleUri}" rel="stylesheet" />
    
    <title>Create Text Annotations</title>
    </head>
    
    <body>
        <div class="content">
            <div class="content-text">
                The text of document will be displayed here
                ${document.getText()}
            </div>
        </div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        
        </html>`;
}
import * as vscode from 'vscode';
import { readFile } from 'fs';
function getText(document:vscode.Uri){
    readFile(document.path, 'utf8', (err, data) => {
        if (err) {
            console.log(err.toString);
        }
        else {
            return data;
        }
    });
}
export function getHtml(scriptUri: vscode.Uri, styleUri: vscode.Uri, document: vscode.Uri, nonce: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    r
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
                ${getText(document)}
                
            </div>
        </div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        
        </html>`;
}
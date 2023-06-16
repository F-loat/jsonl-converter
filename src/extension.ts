import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const convertToJSON = vscode.commands.registerCommand('jsonl-converter.convertToJSON', async (uri: vscode.Uri) => {
    try {
      const newUri = uri.with({ path: uri.path.replace(/jsonl$/, 'json') });
      
      const document = await vscode.workspace.openTextDocument(uri);
      const json = document.getText().split('\n').filter(line => !!line.trim()).map((line: string) => JSON.parse(line));

      vscode.workspace.fs.writeFile(uri, Buffer.from(JSON.stringify(json.length === 1 ? json[0] : json, null, 2)));
      vscode.workspace.fs.rename(uri, newUri);
    } catch (error: any) {
      vscode.window.showErrorMessage(error.message);
    }
  });

  const convertToJSONL = vscode.commands.registerCommand('jsonl-converter.convertToJSONL', async (uri: vscode.Uri) => {
    try {
      const newUri = uri.with({ path: uri.path.replace(/json$/, 'jsonl') });
      
      const document = await vscode.workspace.openTextDocument(uri);
      const jsonl = [].concat(JSON.parse(document.getText())).map((line: unknown) => JSON.stringify(line)).join('\n');

      vscode.workspace.fs.writeFile(uri, Buffer.from(jsonl));
      vscode.workspace.fs.rename(uri, newUri);
    } catch (error: any) {
      vscode.window.showErrorMessage(error.message);
    }
  });

  context.subscriptions.push(convertToJSON);
  context.subscriptions.push(convertToJSONL);
}

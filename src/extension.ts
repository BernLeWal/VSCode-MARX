import * as vscode from 'vscode';
import { MarkdownExplorerProvider } from './markdownExplorer';

// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Extension "Markdown Explorer (MARX)" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('marx.hello', () => {
		vscode.window.showInformationMessage('Hello VS Code from MARX!');
	});

	const disposable2 = vscode.commands.registerCommand('marx.showTime', () => {
		const now = new Date();
		const date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
		const time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
		vscode.window.showInformationMessage('Current time is ' + date + ' ' + time);
	});


	// Markdown Explorer (MARX):
	const marxExplorer = new MarkdownExplorerProvider();
	vscode.window.registerTreeDataProvider('marxExplorer', marxExplorer);

	vscode.commands.registerCommand('marxExplorer.openFile', (resource) => {
		vscode.workspace.openTextDocument(resource).then(doc => vscode.window.showTextDocument(doc));
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

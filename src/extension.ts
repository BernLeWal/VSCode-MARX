import * as vscode from 'vscode';
import { MarkdownExplorerProvider } from './markdownExplorer';

// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "Markdown Explorer (MARX)" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand('marx.hello', () => {
			vscode.window.showInformationMessage('Hello VS Code from MARX!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('marx.showTime', () => {
			const now = new Date();
			const date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
			const time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
			vscode.window.showInformationMessage('Current time is ' + date + ' ' + time);
		})
	);


	// Markdown Explorer (MARX):
	const marxExplorer = new MarkdownExplorerProvider();
	vscode.window.registerTreeDataProvider('marxExplorer', marxExplorer);

	context.subscriptions.push(
		vscode.commands.registerCommand('marxExplorer.openFile', (resource) => {
			vscode.workspace.openTextDocument(resource).then((doc) => {
			vscode.window.showTextDocument(doc);
			});
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('marxExplorer.refresh', () => {
			marxExplorer.refresh(); 
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello VS Code!');
	});

	const disposable2 = vscode.commands.registerCommand('helloworld.showTime', () => {
		const now = new Date();
		const date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
		const time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
		vscode.window.showInformationMessage('Current time is ' + date + ' ' + time);
	});

	const disposable3 = vscode.commands.registerCommand('helloworld.showWarning', () => {
		vscode.window.showWarningMessage('Your warning message here');
	});


	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

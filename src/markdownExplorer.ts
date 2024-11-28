import * as vscode from 'vscode';
import * as path from 'path';

export class MarkdownExplorerProvider
  implements vscode.TreeDataProvider<MarkdownItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<MarkdownItem | undefined | void> =
    new vscode.EventEmitter<MarkdownItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<MarkdownItem | undefined | void> =
    this._onDidChangeTreeData.event;

  getTreeItem(element: MarkdownItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MarkdownItem): Thenable<MarkdownItem[]> {
    if (!vscode.workspace.workspaceFolders) {
      return Promise.resolve([]);
    }

    const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    return Promise.resolve(this.getMarkdownItems(folderPath, element?.resourceUri?.fsPath));
  }

  private getMarkdownItems(basePath: string, folder?: string): MarkdownItem[] {
    const directory = folder ?? basePath;
    const items: MarkdownItem[] = [];

    const fs = require('fs');
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        items.push(
          new MarkdownItem(file, vscode.Uri.file(fullPath), vscode.TreeItemCollapsibleState.Collapsed)
        );
      } else if (file.endsWith('.md')) {
        items.push(new MarkdownItem(file, vscode.Uri.file(fullPath), vscode.TreeItemCollapsibleState.None));
      }
    }

    return items;
  }
}

class MarkdownItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly resourceUri: vscode.Uri,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.resourceUri = resourceUri;

    if (collapsibleState === vscode.TreeItemCollapsibleState.None) {
      this.command = {
        command: 'marxExplorer.openFile',
        title: 'Open Markdown File',
        arguments: [this.resourceUri]
      };
    }
  }

  contextValue = 'markdownItem';
}

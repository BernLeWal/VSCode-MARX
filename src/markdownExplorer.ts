import * as vscode from 'vscode';
import * as path from 'path';

export class MarkdownExplorerProvider
  implements vscode.TreeDataProvider<MarkdownItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<MarkdownItem | undefined | void> =
    new vscode.EventEmitter<MarkdownItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<MarkdownItem | undefined | void> =
    this._onDidChangeTreeData.event;


  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

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
        // check if a file named "README.md" exists in the directory, if yes then open the file, read the first heading, and use that as label for the tree item
        const readmePath = path.join(fullPath, 'README.md');
        if (fs.existsSync(readmePath)) {
          items.push(
            new MarkdownItem(this.getLabel(readmePath), vscode.Uri.file(fullPath), vscode.TreeItemCollapsibleState.Collapsed)
          );
        }
        else {
          items.push(
            new MarkdownItem(file, vscode.Uri.file(fullPath), vscode.TreeItemCollapsibleState.Collapsed)
          );
        }
      } else if (file.endsWith('.md')) {
        if (directory !== basePath && file === 'README.md') {
          continue;
        }
        items.push(
          new MarkdownItem(this.getLabel(fullPath), vscode.Uri.file(fullPath), vscode.TreeItemCollapsibleState.None)
        );
      }
    }

    return items;
  }

  private getLabel(fullPath: string): string {
    // open the file, read the first heading, and use that as label for the tree item
    const fs = require('fs');
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    const firstHeading = lines.find((line: string) => line.startsWith('# '));
    const label = firstHeading ? firstHeading.substring(2).trim() : fullPath;        
    return label;
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
    // if treeitem is collapsible, then check if it has a file named "README.md" in the directory, if yes then create a marxExplorer.openFile command for that file
    else {
      const fs = require('fs');
      const readmePath = path.join(this.resourceUri.fsPath, 'README.md');
      if (fs.existsSync(readmePath)) {
        this.command = {
          command: 'marxExplorer.openFile',
          title: 'Open Markdown File',
          arguments: [vscode.Uri.file(readmePath)]
        };
      }
    }
  }

  contextValue = 'markdownItem';
}

import * as vscode from 'vscode';
import { detectContentType, markdownToPlainText, htmlToPlainText } from './converters';

/**
 * Activates the extension
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Copy as Plain Text extension is now active');

  const copyCommand = vscode.commands.registerCommand('copyPlainText.copy', async () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showWarningMessage('No active editor found');
      return;
    }

    const selection = editor.selection;

    if (selection.isEmpty) {
      vscode.window.showWarningMessage('No text selected');
      return;
    }

    const selectedText = editor.document.getText(selection);

    if (!selectedText.trim()) {
      vscode.window.showWarningMessage('Selected text is empty');
      return;
    }

    try {
      const plainText = convertToPlainText(selectedText);
      await vscode.env.clipboard.writeText(plainText);
      vscode.window.showInformationMessage('Copied as plain text');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      vscode.window.showErrorMessage(`Failed to copy: ${message}`);
    }
  });

  context.subscriptions.push(copyCommand);
}

/**
 * Converts text to plain text based on detected content type
 */
function convertToPlainText(text: string): string {
  const contentType = detectContentType(text);

  switch (contentType) {
    case 'html':
      return htmlToPlainText(text);
    case 'markdown':
      return markdownToPlainText(text);
    case 'plain':
    default:
      return text;
  }
}

/**
 * Deactivates the extension
 */
export function deactivate() {
  console.log('Copy as Plain Text extension deactivated');
}

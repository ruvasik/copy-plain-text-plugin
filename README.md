# Copy as Plain Text

VS Code / Cursor extension that copies selected text as plain text, removing Markdown and HTML markup while preserving line breaks and indentation.

## Features

- **Markdown → Plain Text**: Removes `**`, `__`, `*`, `_`, headers (`#`), links (`[text](url)` → `text`), etc.
- **HTML → Plain Text**: Strips HTML tags, converts `<br>`, `<p>`, `<div>` to line breaks, `<li>` to list items
- **Preserves Structure**: Keeps line breaks, indentation, and code block content
- **Auto-detection**: Automatically detects content type (HTML, Markdown, or plain text)

## Usage

### Commands

- **Copy as Plain Text** - Available in Command Palette (`Cmd/Ctrl + Shift + P`)

### Keyboard Shortcut

- `Cmd + Shift + C` (macOS)
- `Ctrl + Shift + C` (Windows/Linux)

### Context Menu

Right-click on selected text → "Copy as Plain Text"

## Examples

### Markdown Input

```markdown
## Title

- item 1
- item 2

**Bold text** and [link](https://example.com)
```

### Plain Text Output

```
Title

- item 1
- item 2

Bold text and link
```

### HTML Input

```html
<ul>
  <li>One</li>
  <li>Two</li>
</ul>
<p>Paragraph with <strong>bold</strong> text.</p>
```

### Plain Text Output

```
- One
- Two

Paragraph with bold text.
```

## Installation

### From Source

1. Clone the repository
2. Run `npm install`
3. Run `npm run compile`
4. Press `F5` to launch Extension Development Host

### Build VSIX Package

```bash
npm install -g @vscode/vsce
vsce package
```

Then install the `.vsix` file via VS Code: Extensions → ... → Install from VSIX

## Requirements

- VS Code 1.74.0 or higher
- Cursor (any version based on VS Code 1.74.0+)

## License

MIT

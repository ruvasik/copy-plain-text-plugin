/**
 * Markdown to Plain Text converter
 * Removes Markdown markup while preserving structure, line breaks, and indentation
 */

/**
 * Converts Markdown text to plain text
 */
export function markdownToPlainText(text: string): string {
  let result = text;

  // Process code blocks first to preserve their content
  // Store code blocks temporarily and restore them later
  const codeBlocks: string[] = [];
  
  // Handle fenced code blocks (``` or ~~~)
  result = result.replace(/^([ \t]*)(```|~~~)[\w]*\n([\s\S]*?)\n\1\2\s*$/gm, (_, indent, _fence, code) => {
    const index = codeBlocks.length;
    codeBlocks.push(indent + code);
    return `__CODE_BLOCK_${index}__`;
  });

  // Handle inline code blocks - preserve content, remove backticks
  result = result.replace(/`([^`]+)`/g, '$1');

  // Remove headers (# ## ### etc.) but keep the text
  result = result.replace(/^([ \t]*)#{1,6}\s+(.*)$/gm, '$1$2');

  // Remove bold/italic markers
  // Handle *** and ___ (bold + italic)
  result = result.replace(/(\*{3}|_{3})([^*_]+)\1/g, '$2');
  // Handle ** and __ (bold)
  result = result.replace(/(\*{2}|_{2})([^*_]+)\1/g, '$2');
  // Handle * and _ (italic) - be careful not to match list items
  result = result.replace(/(?<![*_\s])(\*|_)([^*_\s][^*_]*[^*_\s])\1(?![*_])/g, '$2');
  result = result.replace(/(?<=\s)(\*|_)([^*_\s][^*_]*[^*_\s])\1(?=\s|$)/g, '$2');

  // Convert links [text](url) → text
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Convert reference links [text][ref] → text
  result = result.replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1');

  // Remove reference definitions [ref]: url
  result = result.replace(/^\s*\[[^\]]+\]:\s+.*$/gm, '');

  // Remove images ![alt](url) → alt (or empty if no alt)
  result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

  // Remove blockquote markers but keep content and indentation
  result = result.replace(/^([ \t]*)>\s?/gm, '$1');

  // Remove horizontal rules
  result = result.replace(/^([ \t]*)[-*_]{3,}\s*$/gm, '');

  // Remove strikethrough ~~text~~ → text
  result = result.replace(/~~([^~]+)~~/g, '$1');

  // Restore code blocks
  codeBlocks.forEach((code, index) => {
    result = result.replace(`__CODE_BLOCK_${index}__`, code);
  });

  // Clean up multiple empty lines (but preserve single empty lines)
  result = result.replace(/\n{3,}/g, '\n\n');

  // Trim trailing whitespace from each line but preserve leading whitespace
  result = result
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n');

  return result.trim();
}

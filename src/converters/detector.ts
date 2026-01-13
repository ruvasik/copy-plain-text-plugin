/**
 * Content type detector
 * Determines whether text is HTML, Markdown, or plain text
 */

export type ContentType = 'html' | 'markdown' | 'plain';

/**
 * Detects the type of content based on patterns in the text
 */
export function detectContentType(text: string): ContentType {
  // Check for HTML first (more specific patterns)
  if (isHtml(text)) {
    return 'html';
  }

  // Check for Markdown patterns
  if (isMarkdown(text)) {
    return 'markdown';
  }

  // Default to plain text
  return 'plain';
}

/**
 * Checks if text contains HTML markup
 */
function isHtml(text: string): boolean {
  // Common HTML tags pattern
  const htmlTagPattern = /<\/?(?:div|span|p|br|a|ul|ol|li|h[1-6]|table|tr|td|th|thead|tbody|img|strong|em|b|i|code|pre|blockquote|section|article|header|footer|nav|main|aside|form|input|button|label|select|option|textarea)[^>]*>/i;

  // Self-closing tags
  const selfClosingPattern = /<(?:br|hr|img|input|meta|link)\s*\/?>/i;

  // HTML entities
  const entityPattern = /&(?:nbsp|lt|gt|amp|quot|apos|#\d+|#x[0-9a-f]+);/i;

  // DOCTYPE or html tag
  const doctypePattern = /<!DOCTYPE|<html/i;

  return (
    htmlTagPattern.test(text) ||
    selfClosingPattern.test(text) ||
    entityPattern.test(text) ||
    doctypePattern.test(text)
  );
}

/**
 * Checks if text contains Markdown markup
 */
function isMarkdown(text: string): boolean {
  // Header patterns: # Title, ## Title, etc.
  const headerPattern = /^#{1,6}\s+.+$/m;

  // Bold/italic: **text**, __text__, *text*, _text_
  const emphasisPattern = /(?:\*{1,2}|_{1,2})[^*_\s][^*_]*[^*_\s](?:\*{1,2}|_{1,2})/;

  // Links: [text](url) or [text][ref]
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)|\[([^\]]+)\]\[([^\]]*)\]/;

  // Images: ![alt](url)
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/;

  // Code blocks: ``` or ~~~
  const codeBlockPattern = /^(?:```|~~~)/m;

  // Inline code: `code`
  const inlineCodePattern = /`[^`]+`/;

  // Blockquote: > text
  const blockquotePattern = /^>\s+.+$/m;

  // Horizontal rule: ---, ***, ___
  const hrPattern = /^(?:[-*_]){3,}\s*$/m;

  return (
    headerPattern.test(text) ||
    emphasisPattern.test(text) ||
    linkPattern.test(text) ||
    imagePattern.test(text) ||
    codeBlockPattern.test(text) ||
    inlineCodePattern.test(text) ||
    blockquotePattern.test(text) ||
    hrPattern.test(text)
  );
}

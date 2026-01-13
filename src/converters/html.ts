/**
 * HTML to Plain Text converter
 * Removes HTML tags while preserving structure, line breaks, and indentation
 */

/**
 * Converts HTML text to plain text
 */
export function htmlToPlainText(text: string): string {
  let result = text;

  // Remove script and style tags with their content
  result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Remove HTML comments
  result = result.replace(/<!--[\s\S]*?-->/g, '');

  // Handle pre/code blocks - preserve their content
  const preBlocks: string[] = [];
  result = result.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, content) => {
    const index = preBlocks.length;
    // Strip code tags inside pre
    const cleaned = content.replace(/<\/?code[^>]*>/gi, '');
    preBlocks.push(decodeHtmlEntities(cleaned));
    return `__PRE_BLOCK_${index}__`;
  });

  // Handle code blocks
  result = result.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, content) => {
    return decodeHtmlEntities(content);
  });

  // Convert block elements to line breaks
  // These elements should start on a new line
  result = result.replace(/<\/?(div|p|section|article|header|footer|nav|main|aside|blockquote|h[1-6])[^>]*>/gi, '\n');

  // Handle br tags
  result = result.replace(/<br\s*\/?>/gi, '\n');

  // Handle hr tags
  result = result.replace(/<hr\s*\/?>/gi, '\n');

  // Handle lists
  result = convertLists(result);

  // Handle tables
  result = convertTables(result);

  // Handle links - keep text only
  result = result.replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1');

  // Handle emphasis tags
  result = result.replace(/<\/?(strong|b|em|i|u|s|strike|del|ins|mark|small|sub|sup)[^>]*>/gi, '');

  // Remove all remaining tags
  result = result.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  result = decodeHtmlEntities(result);

  // Restore pre blocks
  preBlocks.forEach((block, index) => {
    result = result.replace(`__PRE_BLOCK_${index}__`, block);
  });

  // Clean up whitespace
  // Collapse multiple spaces (but not at line start)
  result = result
    .split('\n')
    .map(line => {
      const leadingWhitespace = line.match(/^(\s*)/)?.[1] || '';
      const rest = line.slice(leadingWhitespace.length);
      return leadingWhitespace + rest.replace(/  +/g, ' ').trim();
    })
    .join('\n');

  // Clean up multiple empty lines
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}

/**
 * Converts HTML lists (ul, ol) to plain text with proper indentation
 */
function convertLists(html: string): string {
  let result = html;
  let depth = 0;
  const listStack: ('ul' | 'ol')[] = [];
  const counterStack: number[] = [];

  // Process list tags sequentially
  const tokens = result.split(/(<\/?(?:ul|ol|li)[^>]*>)/gi);
  result = '';

  for (const token of tokens) {
    const lowerToken = token.toLowerCase();

    if (lowerToken.startsWith('<ul')) {
      listStack.push('ul');
      counterStack.push(0);
      depth++;
    } else if (lowerToken.startsWith('<ol')) {
      listStack.push('ol');
      counterStack.push(0);
      depth++;
    } else if (lowerToken === '</ul>' || lowerToken === '</ol>') {
      listStack.pop();
      counterStack.pop();
      depth = Math.max(0, depth - 1);
    } else if (lowerToken.startsWith('<li')) {
      const indent = '  '.repeat(Math.max(0, depth - 1));
      const listType = listStack[listStack.length - 1];

      if (listType === 'ol') {
        counterStack[counterStack.length - 1]++;
        result += `\n${indent}${counterStack[counterStack.length - 1]}. `;
      } else {
        result += `\n${indent}- `;
      }
    } else if (lowerToken === '</li>') {
      // Do nothing, just remove the tag
    } else {
      result += token;
    }
  }

  return result;
}

/**
 * Converts HTML tables to plain text
 */
function convertTables(html: string): string {
  let result = html;

  // Simple table conversion - each cell separated by tab, rows by newline
  result = result.replace(/<\/tr>/gi, '\n');
  result = result.replace(/<\/t[dh]>/gi, '\t');
  result = result.replace(/<t[dh][^>]*>/gi, '');
  result = result.replace(/<\/?(?:table|thead|tbody|tfoot|tr|colgroup|col|caption)[^>]*>/gi, '\n');

  return result;
}

/**
 * Decodes common HTML entities
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&bull;': '•',
    '&middot;': '·',
    '&deg;': '°',
    '&plusmn;': '±',
    '&times;': '×',
    '&divide;': '÷',
    '&frac12;': '½',
    '&frac14;': '¼',
    '&frac34;': '¾',
  };

  let result = text;

  // Replace named entities
  for (const [entity, char] of Object.entries(entities)) {
    result = result.split(entity).join(char);
  }

  // Replace numeric entities (decimal)
  result = result.replace(/&#(\d+);/g, (_, code) => {
    return String.fromCharCode(parseInt(code, 10));
  });

  // Replace numeric entities (hex)
  result = result.replace(/&#x([0-9a-f]+);/gi, (_, code) => {
    return String.fromCharCode(parseInt(code, 16));
  });

  return result;
}

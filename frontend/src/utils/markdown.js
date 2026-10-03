import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Render Markdown string to safe sanitized HTML
 * @param {string} content - Raw markdown text
 * @returns {string} Sanitized HTML
 */
export function renderMarkdown(content) {
  if (!content || typeof content !== 'string') return '';
  const rawHtml = marked.parse(content);
  return DOMPurify.sanitize(rawHtml);
}

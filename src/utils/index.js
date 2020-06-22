/* eslint-disable import/prefer-default-export */

import DOMPurify from 'dompurify';
import marked from 'marked';

// Customize the output for links when rendering HTML from Markdown.
const renderer = new marked.Renderer();
renderer.link = (href, title, text) =>
  // prettier-ignore
  `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title ?? ''}">${text}</a>`;

/**
 * @param {string} markdown
 * @returns {string}
 */
const insertMentionLinks = (markdown) =>
  markdown.replace(/\B(@([a-zA-Z0-9](-?[a-zA-Z0-9_])+))/g, `**[$1](https://github.com/$2)**`);

/**
 * @param {string} markdown
 * @returns {string}
 */
export function renderHtmlFromMarkdown(markdown) {
  const markdownWithMentionLinks = insertMentionLinks(markdown);
  const dirtyHtml = marked(markdownWithMentionLinks, { renderer });
  const cleanHtml = DOMPurify.sanitize(dirtyHtml, { ADD_ATTR: ['target'] });
  return cleanHtml;
}

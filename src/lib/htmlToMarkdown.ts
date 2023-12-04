import TurndownService from "turndown";

const turndownService = new TurndownService();

export function convertHtmlToMarkdown(html: string) {
  return turndownService.turndown(html);
}

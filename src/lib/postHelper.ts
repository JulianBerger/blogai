import { input } from "@inquirer/prompts";
import * as cheerio from "cheerio";

export interface PostData {
  originalUrl?: URL;
  title: string;
  html: string;
}

export enum PostLengths {
  Short = "6 H2/H3 headings",
  Medium = "12-18 H2/H3 Headings",
  Long = "20+ h2/h3 headings",
}

/** Fetches a Blog post from a url that we promt the user */
export async function getPostFromUrlPromt() {
  let url = "";

  while (!url) {
    url = await input({
      message: "Enter the URL of the article you want to summarize",
    });
  }

  return getPostFromUrl(url);
}

export async function getPostFromUrl(url: string): Promise<PostData> {
  const originalUrl = new URL(url);

  // get the article text
  const response = await fetch(originalUrl);
  const html = await response.text();
  const doc = cheerio.load(html);

  const title = doc("h1").text();
  const article = doc("article");
  const articleHtml = article.html();

  if (!articleHtml) {
    throw new Error("No article text found");
  }

  return {
    originalUrl,
    title,
    html: articleHtml,
  };
}

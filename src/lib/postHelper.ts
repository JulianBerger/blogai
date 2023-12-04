import { input } from "@inquirer/prompts";
import * as cheerio from "cheerio";
import { WorkflowPost } from "../interfaces/workflow.ts";
import { dumpTextToFile } from "./file-helper.ts";

export interface PostData {
  originalUrl?: URL;
  title: string;
  html: string;
}

export enum PostLengths {
  Short = "6 H2/H3 headings",
  Medium = "12-18 H2/H3 Headings",
  Long = "20+ H2/H3 headings",
}

/** Fetches a Blog post from a url that we promt the user */
export async function getPostFromUrlPromt() {
  let url = "";

  while (!url) {
    url = await input({
      message: "Enter the URL of the article you want to summarize",
    });
  }

  const title = await input({
    message:
      "Enter the title of the article, if you want to change it, otherwise leave empty",
  });

  const workflowPost: WorkflowPost = {
    postUrl: url,
    title,
  };
  return workflowPost;
}

export async function dumpPostArticleContentFromUrl(
  url: string,
): Promise<PostData> {
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

  dumpTextToFile({
    filename: title || new Date().getTime() + ".html",
    text: articleHtml,
  });

  return {
    originalUrl,
    title,
    html: articleHtml,
  };
}

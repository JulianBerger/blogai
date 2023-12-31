import OpenAI from "openai";
import fs from "fs";
import { Readable } from "stream";
import nodeFetch from "node-fetch";
import { downloadFile } from "./download.ts";
import { getSlug } from "./slug.ts";
import { getPathSafe } from "./path.ts";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not set");
}

export const DEFAULT_MODEL = "gpt-3.5-turbo";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function downloadImageForPrompt(
  prompt: string,
  size:
    | "256x256"
    | "512x512"
    | "1024x1024"
    | "1792x1024"
    | "1024x1792" = "1792x1024",
) {
  console.info("generateImageFromPrompt", { prompt, size });

  const imageResult = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    size,
    quality: "hd",
    n: 1,
  });

  if (!imageResult) {
    return undefined;
  }

  const imageUrl = imageResult.data.shift()?.url;

  if (!imageUrl) {
    return undefined;
  }

  // get filename from promt
  const fileName = getSlug(prompt, { lower: true, strict: true }) + ".jpg";

  const filePath = getPathSafe("./.generated-images", fileName);

  // download image to file
  await downloadFile(imageUrl, filePath);

  return filePath;
}

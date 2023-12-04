import { PostLengths } from "../lib/postHelper.ts";
import { InternalLink } from "./links.ts";
import { WebsiteInformation } from "./website.ts";

export interface GeneratorInput {
  /** Our Website we want to write the blog post for */
  website: WebsiteInformation;
  /** If we want to set the title, set it here, otherwise gpt will generate one for us */
  format?: "markdown" | "html";
  /** This is a sample post to let gpt learn the format we are aiming for. */
  samplePost?: string;
  /** If we want to set the title, set it here, otherwise gpt will generate one for us */
  title?: string;
  /** This is the input blog post(s) in markdown to learn from based on that we create the new one */
  originalPostMd?: string | string[];
  /** Title of the original post */
  originalPostTitle?: string | string[];
  /** Url Of the Original Post */
  originalPostUrl?: string | string[];
  /** Keywords we want to rank for (if empty we don't target any specific keywords) */
  keywords?: string[];
  /** Length of the resulting Post */
  postLength?: PostLengths;
}

export interface GeneratorOutput {
  /** Our Website we want to write the blog post for */
  website: WebsiteInformation;
  /** If we want to set the title, set it here, otherwise gpt will generate one for us */
  title: string;
  /** The Post, can be markdown or html, what ever you put in as input */
  postText: string;
  /** Title Image Path */
  titleImagePath?: string;
  /** Post Image Paths */
  postImagePaths?: string[];
}

export type GeneratorFunction = (
  input: GeneratorInput,
) => Promise<GeneratorOutput>;

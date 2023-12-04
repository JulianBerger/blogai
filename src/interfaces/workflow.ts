import { PostLengths } from "../lib/postHelper.ts";
import { WebsiteInformation } from "./website.ts";

export interface WorkflowPost {
  /** Url of the Post(s) we want to crawl */
  postUrl?: string | string[];

  /** Title we want our article to have (can be empty for auto generated) */
  title?: string;

  /** Keywords we want to rank for */
  keywords?: string[];

  /** Length of the resulting Post */
  postLength?: PostLengths;
}

export interface Workflow {
  /** Name of the Workflow */
  name: string;

  /** Start Date of the Workflow Run */
  startDate?: Date;

  /** Website for the Workflow */
  website: WebsiteInformation;

  /** Sample post for formatting */
  samplePost?: string;

  /** Post Metadata of posts we want to generate */
  posts: WorkflowPost[];

  /** Post Fileextension (the filextension of the post file after creation) */
  postFileExtension?: string;

  /** Post Filepath (the filepath of the post file after creation) */
  postFilePath?: string;

  /** Post Image Filepath (the filepath the images gets moved to) */
  postImageFilePath?: string;
}

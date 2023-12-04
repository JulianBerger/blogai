import { InternalLink } from "./links.ts";

export interface WebsiteInformation {
  url: URL;
  name: string;
  keywords: string[];
  categories: string[];
  internalLinks?: InternalLink[];
}

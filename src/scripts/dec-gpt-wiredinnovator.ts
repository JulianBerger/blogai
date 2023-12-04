import { ChatCompletionMessageParam } from "openai/resources";
import dumpTextToFile from "../lib/dumpToFiles";
import { openai } from "../lib/gpt";
import { convertHtmlToMarkdown } from "../lib/htmlToMarkdown";
import { PostLengths, getPostFromUrlPromt } from "../lib/postHelper";
import examplePost from "../content/example-blog-struct-dec01";

export default async function DecGptWiredinnovator() {
  const post = await getPostFromUrlPromt();

  dumpTextToFile(post.html, "dec-gpt-wiredinnovator.txt");

  // convert to markdown
  const postMd = convertHtmlToMarkdown(post.html);
  const title = post.title;
  const keywords = ["wipe", "macOs", "cleaninstall"];

  console.log("Post title:", post.title);

  dumpTextToFile(postMd, "dec-gpt-wiredinnovator.md");

  const gptMessages: Array<ChatCompletionMessageParam> = [];

  gptMessages.push({ role: "user", content: `Use markdown formatting.` });
  gptMessages.push({
    role: "user",
    content: `Use this example to shape your article. Use the same formatting.:\n '${examplePost}'`,
  });
  gptMessages.push({
    role: "user",
    content: `Ensure all tables are in their own markdown formatting box`,
  });
  gptMessages.push({
    role: "user",
    content: `EVERY PARAGRAPH MUST INCLUDE SOME FORMATTING Tables, H2, Lists, Italics, Quotes, Bold, Internal links and images.`,
  });
  gptMessages.push({
    role: "user",
    content: `Write an H1 title then use H2/H3 headings (never mention h1/h2/h3 just use markdown formatting)`,
  });
  gptMessages.push({
    role: "user",
    content: `There should be a key takeaways table at the top of the article.`,
  });
  gptMessages.push({
    role: "user",
    content: `Write the article in Professional Voice and First person plural (we, us, our, ours)`,
  });
  gptMessages.push({
    role: "user",
    content: `I'm writing for the Website: https://wiredinnovator.com`,
  });
  gptMessages.push({
    role: "user",
    content: `The keywords i want to rank for are:\n ${keywords.join(", ")}`,
  });
  gptMessages.push({
    role: "user",
    content: `The post I want to have should have a title like this: "${title}" - but not exactly this!`,
  });
  gptMessages.push({
    role: "user",
    content: `The post I want to have should have these information:\n "${postMd}"`,
  });
  gptMessages.push({
    role: "user",
    content: `The Article should be length should be: ${PostLengths.Medium}.`,
  });

  gptMessages.push({
    role: "user",
    content: `if you do not follow the <vital points>, you have failed.

    <vital points>
     
    TWO VITAL POINTS - ONCE AN INTERNAL LINK IS USED, REMOVE IT FROM THE LIST AND NEVER USE IT AGAIN. SECONDLY, THE MORE LISTS TABLES BOLD ETC (WITHOUT EXAGGERATION) THE MORE LIKELY THE ARTICLE IS TO RANK ON GOOGLE
     
    </vital points>`,
  });

  gptMessages.push({
    role: "user",
    content: `You should include a lot of formatting, including:
 
    Conclusion
    Tables
    H3
    Lists
    Italics
    Quotes
    Key Takeaways
    FAQ
    Bold
    Internal links`,
  });

  gptMessages.push({
    role: "user",
    content: `Every two paragraphs should have a table or list or quote - vary the anchor text if you're going to repeat the same internal link multiple times.`,
  });

  const result = await openai.chat.completions.create({
    messages: gptMessages,
    model: "gpt-4-1106-preview",
  });

  if (!result) {
    throw new Error("No result from GPT");
  }

  const responseText = result.choices.shift()!.message.content;

  console.log({ responseText });

  if (responseText) {
    dumpTextToFile(responseText, "dec-gpt-wiredinnovator-responseText.md");
  }
}

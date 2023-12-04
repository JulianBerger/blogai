import { ChatCompletionMessageParam } from "openai/resources";
import dumpTextToFile from "../lib/dumpToFiles";
import { generateImageFromPrompt, openai } from "../lib/gpt";
import { convertHtmlToMarkdown } from "../lib/htmlToMarkdown";
import { PostLengths, getPostFromUrlPromt } from "../lib/postHelper";
import examplePost from "../content/example-blog-struct-dec01";
import { getStockImagesForQuery } from "../lib/stockImage";

export default async function DecGptWiredinnovator() {
  const post = await getPostFromUrlPromt();

  dumpTextToFile(post.html, "dec-gpt-wiredinnovator.txt");

  // convert to markdown
  const postMd = convertHtmlToMarkdown(post.html);
  const title = post.title;
  const categories = ["Tech", "Reviews", "HowTo", "Tutorials"];
  const keywords = ["wipe", "macOs", "cleaninstall"];
  const curUrl = "https://wiredinnovator.com";
  const curName = "Wiredinnovator";

  dumpTextToFile(postMd, "dec-gpt-wiredinnovator.md");

  const gptMessages: Array<ChatCompletionMessageParam> = [];

  gptMessages.push({ role: "user", content: `Use markdown formatting.` });
  gptMessages.push({
    role: "user",
    content: `Use this example to shape your article. Use the same formatting.:\n '${examplePost}'`,
  });
  gptMessages.push({
    role: "user",
    content: `Replace <TITLE> with the title of the article (it will be the h1) - it should not include ":"!'`,
  });
  gptMessages.push({
    role: "user",
    content: `Replace <DESCRIPTION> with a short description of the article - it should be about 155 characters long!`,
  });
  gptMessages.push({
    role: "user",
    content: `Replace <DATE> todays Date in the format: 2021-12-01`,
  });
  gptMessages.push({
    role: "user",
    content: `Replace <CATEGORY> with the best fitting Category out of the following list: ${categories.join(
      ", ",
    )}`,
  });
  gptMessages.push({
    role: "user",
    content: `EVERY PARAGRAPH MUST INCLUDE SOME FORMATTING Tables, H2, Lists, Italics, Quotes, Bold, Internal links and images.`,
  });
  gptMessages.push({
    role: "user",
    content: `Use only H2/H3 headings (never mention h2/h3 just use markdown formatting)`,
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
    content: `I'm writing for the Website: "${curUrl}" it's name is "${curName}`,
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
    content: `The Article should not have any links to a page from the domain: ${post.originalUrl?.origin}.`,
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

  dumpTextToFile(
    JSON.stringify(gptMessages, null, 2),
    "dec-gpt-messages-wiredinnovator.json",
  );

  const result = await openai.chat.completions.create(
    {
      messages: gptMessages,
      model: "gpt-4-1106-preview",
    },
    {
      timeout: 1000 * 60 * 60 * 2, // 2 hours
    },
  );

  if (!result) {
    throw new Error("No result from GPT");
  }

  const responseText = result.choices.shift()!.message.content;

  console.log({ responseText });

  if (responseText) {
    dumpTextToFile(responseText, "dec-gpt-wiredinnovator-responseText.md");
  }

  // get post image prompt

  const stockImageQueryResult = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `give me a search query that i can enter in a stock image library to find images suiting this post: ${postMd} - answer only with the query - it should not include words like "stock" or "images"!`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  const stockImageQuery =
    stockImageQueryResult.choices.shift()!.message.content || title;

  // get stock images
  const stockImages = await getStockImagesForQuery(stockImageQuery, 2);

  console.log({ stockImageQuery, stockImages });

  return;

  const imagePromptResult = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `give me a prompt to generate a blog title image for this post: ${postMd} - answer only with the prompt!`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  const imagePrompt =
    imagePromptResult.choices.shift()!.message.content || title;

  // generate image
  const imageUrl = await generateImageFromPrompt(imagePrompt);

  console.log({ imagePrompt, imageUrl });
}

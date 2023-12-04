import { downloadImageForPrompt, openai } from "../lib/gpt.ts";
import { PostLengths } from "../lib/postHelper.ts";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { GeneratorInput, GeneratorOutput } from "../interfaces/generator.ts";
import { dumpTextToFile } from "../lib/file-helper.ts";

const GPT_MODEL = "gpt-4-1106-preview";

export default async function DecGptWiredinnovator({
  format = "markdown",
  title,
  originalPostTitle,
  website,
  keywords,
  samplePost,
  originalPostMd,
  originalPostUrl,
  postLength = PostLengths.Medium,
}: GeneratorInput) {
  const gptMessages: Array<ChatCompletionMessageParam> = [];

  gptMessages.push({ role: "user", content: `Use ${format} formatting.` });
  if (samplePost) {
    gptMessages.push({
      role: "user",
      content: `Use this example to shape your article. Use the same formatting.:\n '${samplePost}'`,
    });
  } else {
    console.warn(
      "No sample post provided - this will make the gpt output worse!",
    );
  }
  gptMessages.push({
    role: "user",
    content: `Replace <TITLE> with the title of the article (it will be the h1) - it should not include any of these characters: ":,<>"!'`,
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
    content: `Replace <CATEGORY> with the best fitting Category out of the following list: ${website.categories.join(
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
    content: `I'm writing for the Website: "${website.url.origin}" it's name is "${website.name}`,
  });
  if (keywords?.length) {
    gptMessages.push({
      role: "user",
      content: `The keywords i want to rank for are:\n ${keywords.join(", ")}`,
    });
  }
  // if a title is set use it, otherwise create a new one based on the original post title
  if (title) {
    gptMessages.push({
      role: "user",
      content: `The post I want to have should have the title: "${title}" - exactly like this!`,
    });
  } else if (originalPostTitle) {
    gptMessages.push({
      role: "user",
      content: `The post I want to have should have a title like this: "${title}" - but not exactly this!`,
    });
  }
  if (originalPostMd) {
    gptMessages.push({
      role: "user",
      content: `The post I want to have should have these information:\n "${originalPostMd}"`,
    });
  } else {
    throw new Error("No original post markdown provided!");
  }
  gptMessages.push({
    role: "user",
    content: `The Article should be length should be: ${postLength}.`,
  });
  if (originalPostUrl) {
    gptMessages.push({
      role: "user",
      content: `The Article should not have any links to a page from the domain: ${
        Array.isArray(originalPostUrl)
          ? originalPostUrl.join(", ")
          : originalPostUrl
      }.`,
    });
  }
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

  dumpTextToFile({
    filename: `gpt-msg-${title}.json`,
    text: JSON.stringify(gptMessages, null, 2),
  });

  const blogPostGenResult = await openai.chat.completions.create(
    {
      messages: gptMessages,
      model: GPT_MODEL,
    },
    {
      timeout: 1000 * 60 * 60 * 2, // 2 hours
    },
  );

  if (!blogPostGenResult) {
    throw new Error("No result from GPT");
  }

  console.log(
    "blog post cost me",
    blogPostGenResult.usage?.prompt_tokens,
    "tokens",
  );

  const responseText = blogPostGenResult.choices.shift()!.message.content;

  if (responseText) {
    dumpTextToFile({
      filename: `md-${title}-gpt.md`,
      text: responseText,
    });
  }

  /**
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

   */

  // ask next question

  // get post image prompt
  const imagePromptResult = await openai.chat.completions.create({
    messages: [
      ...gptMessages,
      {
        role: "assistant",
        content: responseText,
      },
      {
        role: "user",
        content: `give me a prompt to generate a blog title image for the post you just generated - answer only with the prompt!`,
      },
    ],
    model: GPT_MODEL,
  });

  console.log(
    "title cost me",
    imagePromptResult.usage?.prompt_tokens,
    "tokens",
  );

  const imagePrompt =
    imagePromptResult.choices.shift()!.message.content || title;

  let titleImagePath: string | undefined;
  if (imagePrompt) {
    // generate image
    titleImagePath = await downloadImageForPrompt(imagePrompt);
  }

  return {
    title,
    postText: responseText,
    titleImagePath,
  } as GeneratorOutput;
}

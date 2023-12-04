import { Separator, input, select } from "@inquirer/prompts";
import runGenerator from "./lib/runGenerator.ts";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {
  dumpPostArticleContentFromUrl,
  getPostFromUrlPromt,
} from "./lib/postHelper.js";
import { convertHtmlToMarkdown } from "./lib/htmlToMarkdown.js";
import { getPathSafe } from "./lib/path.ts";
import { Workflow, WorkflowPost } from "./interfaces/workflow.ts";
import { GeneratorInput } from "./interfaces/generator.ts";
import workflow from "./workflows/lifehacker-4-dec.ts";
import { exportFilesForWorkflow } from "./lib/workflow.ts";

dotenv.config();

// make a blue color console log:
console.log("\x1b[34m", "Welcome to BlogAI!");

const inputMethod = await select({
  message: "Select a Input Method",
  choices: [
    {
      name: "Create a new blog post from url input",
      value: "urlInput",
    },
    {
      name: "Create blog post(s) from workflow file",
      value: "workflowFile",
    },
  ],
});

/** These are the workflows we run */
let activeWorkflow: Workflow | undefined;

if (inputMethod === "urlInput") {
  // get Post from url
  const post = await getPostFromUrlPromt();

  const websiteUrl = await input({
    message: "Enter the url of your Website (you want to create the post for)",
  });

  const websiteName = await input({
    message: "Enter the name of your Website (you want to create the post for)",
  });

  activeWorkflow = {
    name: "User Input Workflow",
    startDate: new Date(),
    website: {
      name: websiteName,
      url: new URL(websiteUrl),
      categories: [],
      keywords: [],
    },
    posts: [post],
  };
} else if (inputMethod === "workflowFile") {
  // get all the workflows in the workflows folder
  // and display them as a list
  const workflowsFolder = getPathSafe("./src/workflows");
  const workflows = fs.readdirSync(workflowsFolder);
  const workflowChoices = workflows.map((workflow) => {
    return {
      name: workflow.split(".")[0],
      value: workflow,
    };
  });

  const workflowToRun = await select({
    message: "Select a workflow to run",
    choices: workflowChoices,
  });

  if (workflowToRun) {
    const workflow = (await import(`./workflows/${workflowToRun}`))
      .default as Workflow;

    console.info("\x1b[34m", `Running workflow: "${workflow.name}"`);

    activeWorkflow = { ...workflow, startDate: new Date() };
  }
}

// get all the generators in the generators folder
// and display them as a list
const generatorsFolder = getPathSafe("./src/generators");
const generators = fs.readdirSync(generatorsFolder);
const generatorChoices = generators.map((generator) => {
  return {
    name: generator,
    value: generator,
  };
});

const scriptToRun = await select({
  message: "Select a generator to run",
  choices: generatorChoices,
});

if (!scriptToRun) {
  throw new Error("No generator selected");
}

for (const post of workflow.posts) {
  try {
    let originalPostMd: string | string[];
    let originalPostUrl: string | string[];
    let postTitle = post.title;
    if (!post.postUrl) {
      continue;
    } else if (Array.isArray(post.postUrl)) {
      throw new Error("Multiple posts not supported yet");
    } else {
      const postData = await dumpPostArticleContentFromUrl(post.postUrl);

      originalPostMd = convertHtmlToMarkdown(postData.html);
      originalPostUrl = post.postUrl;
      if (!postTitle) {
        postTitle = postData.title;
      }
    }

    const generatorInput: GeneratorInput = {
      website: workflow.website,
      title: post.title,
      originalPostMd: originalPostMd,
      originalPostUrl: originalPostUrl,
      keywords: post.keywords,
      samplePost: workflow.samplePost,
    };

    const generatorResult = await runGenerator(
      `./generators/${scriptToRun}`,
      generatorInput,
    );

    if (generatorResult) {
      await exportFilesForWorkflow(workflow, generatorResult);
    }
  } catch (err) {
    console.error(err);
  }
}

console.log("\x1b[34m", "Finished!");

// print out time it took to run the script
const endTime = new Date();
const timeDiff =
  endTime.getTime() - (activeWorkflow?.startDate || endTime).getTime();

console.log(
  "\x1b[34m",
  `Time it took to run: ${timeDiff / 1000} seconds or ${
    timeDiff / 1000 / 60
  } minutes or ${timeDiff / 1000 / 60 / 60} hours`,
);

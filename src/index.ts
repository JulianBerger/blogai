import { Separator, input, select } from "@inquirer/prompts";
import runModule from "./lib/runModule.ts";
import * as dotenv from "dotenv";
dotenv.config();

// make a red color console log:
console.log("\x1b[31m", "Welcome to BlogAI!");

const scriptToRun = await select({
  message: "Select a script to run",
  choices: [
    {
      name: "dec-gpt-wiredinnovator",
      value: "dec-gpt-wiredinnovator",
    },
    {
      name: "yarn",
      value: "yarn",
      description: "yarn is an awesome package manager",
    },
  ],
});

if (scriptToRun) {
  runModule(`./scripts/${scriptToRun}.ts`);
}

import { GeneratorOutput } from "../interfaces/generator.ts";
import { Workflow } from "../interfaces/workflow.ts";
import { copyFile, dumpTextToFile } from "./file-helper.ts";
import { getPathSafe } from "./path.ts";
import { getSlug } from "./slug.ts";

export async function exportFilesForWorkflow(
  workflow: Workflow,
  generatedOutput: GeneratorOutput,
) {
  const outputDirectoryPrefix = `./blogai-output/${getSlug(workflow.name)}-${
    (workflow.startDate || new Date()).toISOString().split("T")[1]
  }`;
  const postSlug = getSlug(generatedOutput.title);

  const postFilePath = getPathSafe(
    workflow.postFilePath
      ? `${outputDirectoryPrefix}/${workflow.postFilePath}/`
      : `${outputDirectoryPrefix}/${postSlug}/`,
  );

  const postFileExtension = workflow.postFileExtension || "md";

  const postImageFilePath = getPathSafe(
    workflow.postImageFilePath
      ? `${outputDirectoryPrefix}/${workflow.postImageFilePath}/`
      : `${outputDirectoryPrefix}/${postSlug}/`,
  );

  console.log({ postFilePath });

  // export markdown file
  dumpTextToFile({
    text: generatedOutput.postText,
    outputPath: postFilePath,
    filename: `${postSlug}.${postFileExtension}`,
  });

  // export title image
  if (generatedOutput.titleImagePath) {
    copyFile(generatedOutput.titleImagePath, `${postSlug}.jpg`);
  }

  // export post images
  (generatedOutput.postImagePaths || []).forEach((image) => {
    copyFile(image, postImageFilePath);
  });
}

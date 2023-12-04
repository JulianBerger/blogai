import fs from "fs";
import path from "path";

/** Gets a relative path to the module and makes sure it exists
 * If the file name is not provided, it will return the folder path
 */
export function getPathSafe(inputPath: string, fileName?: string) {
  const folder = path.join(path.resolve(), inputPath);

  // create output folder if it doesn't exist (recursively)
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  if (fileName) {
    return path.join(folder, fileName);
  }

  return folder;
}

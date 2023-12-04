import path from "path";
import fs from "fs";
import { getPathSafe } from "./path.ts";

interface DumpToFileOptions {
  text: string;
  filename?: string;
  outputPath?: string;
}

export function dumpTextToFile({
  text,
  filename = "output.txt",
  outputPath = "./.temp-output",
}: DumpToFileOptions) {
  const filePath = getPathSafe(outputPath, filename);

  fs.writeFile(filePath, text, (err: any) => {
    if (err) {
      console.error("dumpTextToFile: Can not write File", err);
    }
  });
}

export function copyFile(source: string, destination: string) {
  const sourcePath = getPathSafe(source);
  const destinationPath = getPathSafe(destination);

  fs.copyFile(sourcePath, destinationPath, (err: any) => {
    if (err) {
      console.error("copyFile: Can not copy File", err);
    }
  });
}

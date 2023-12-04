import path from "path";
import fs from "fs";

const outputFolder = path.join(path.resolve(), "./.temp-output");

console.log("outputFolder", outputFolder);

// create output folder if it doesn't exist
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

export default function dumpTextToFile(text: string, filename = "output.txt") {
  const filePath = path.join(outputFolder, filename);
  fs.writeFile(filePath, text, (err: any) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
}

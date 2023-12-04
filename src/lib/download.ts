import fs from "fs";
import https from "https";

export async function downloadFile(url: string, filePath: fs.PathLike) {
  const response = await https.get(url);

  const fileStream = fs.createWriteStream(filePath);
  response.pipe(fileStream);

  await new Promise((resolve, reject) => {
    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
  });
}

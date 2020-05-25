//! Adapted from Github Gist https://gist.github.com/hackhat/cc0adf1317eeedcec52b1a4ff38f738b


const fs = require("fs");
const path = require("path");
const mime = require("mime");

const AWS = require("aws-sdk");

const srcFolder = "" + (process.argv[2] || "dist");

const destFolder = "" + (process.argv[3] || "stage/zsui");

// Config
const config = {
  accessKeyId: "AKIAIWWPETJAFN2VQZFA",
  secretAccessKey: "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",
  s3BucketName: "ui.zsservices.com",
  srcFolder: srcFolder,
  destFolder: destFolder,
  region: "us-east-2"
};

const startUpload = async ({ accessKeyId, secretAccessKey, s3BucketName, srcFolder, destFolder, region }) => {

  AWS.config.setPromisesDependency(Promise);
  AWS.config.update({ "accessKeyId": accessKeyId, "secretAccessKey": secretAccessKey, "region": region });

  const s3 = new AWS.S3();

  const filesPaths = await walkSync(srcFolder);

  for (let i = 0; i < filesPaths.length; i++) {
    const statistics = `(${i + 1}/${filesPaths.length}, ${Math.round((i + 1) / filesPaths.length * 100)}%)`;
    const filePath = filesPaths[i];
    const fileContent = fs.readFileSync(filePath);
    // If the slash is like this "/" s3 will create a new folder, otherwise will not work properly.
    const relativeToBaseFilePath = path.normalize(path.relative(srcFolder, filePath));
    const relativeToBaseFilePathForS3 = relativeToBaseFilePath.split(path.sep).join('/');
    const mimeType = mime.getType(filePath);

    console.log(`Uploading `, statistics, relativeToBaseFilePathForS3);
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property

    await s3.putObject({
      //ACL: `public-read`,
      Bucket: s3BucketName + "/" + destFolder,
      Key: relativeToBaseFilePathForS3,
      Body: fileContent,
      ContentType: mimeType,
    }).promise();

    console.log(`Uploaded `, statistics, relativeToBaseFilePathForS3);

  }
};

startUpload(config).then(() => {
  console.log(`Completed!`);
});

async function walkSync(dir) {
  const files = fs.readdirSync(dir);
  const output = [];
  for (const file of files) {
    const pathToFile = path.join(dir, file);
    const isDirectory = fs.statSync(pathToFile).isDirectory();
    if (isDirectory) {
      output.push(...await walkSync(pathToFile));
    } else {
      output.push(await pathToFile);
    }
  }
  return output;
}
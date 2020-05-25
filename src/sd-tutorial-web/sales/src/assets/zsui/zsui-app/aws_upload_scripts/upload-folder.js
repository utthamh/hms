/*
 * Adapted from Github Gist https://gist.github.com/hackhat/cc0adf1317eeedcec52b1a4ff38f738b
*/

const fs = require("fs");
const path = require("path");
const mime = require("mime");

const AWS = require("aws-sdk");

const srcFolder = "" + (process.argv[2] || "dist/app");

const destFolder = "" + (process.argv[3] || "stage/app");

const isFile = process.argv.join("").indexOf("--file") != -1;

const cleanFirst = process.argv.join("").indexOf("--clean") != -1;

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

  if (isFile) {
    const filePath = srcFolder;
    srcFolder = srcFolder.slice(0, srcFolder.lastIndexOf("/"));

    const fileContent = fs.readFileSync(filePath);

    // If the slash is like this "/" s3 will create a new folder, otherwise will not work properly.
    const relativeToBaseFilePath = path.normalize(path.relative(srcFolder, filePath));
    const relativeToBaseFilePathForS3 = relativeToBaseFilePath.split(path.sep).join('/');
    const mimeType = mime.getType(filePath);

    console.log(`Uploading `, relativeToBaseFilePathForS3);
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property

    await s3.putObject({
      //ACL: `public-read`,
      Bucket: s3BucketName + (destFolder === "./" ? "" : "/" + destFolder),
      Key: relativeToBaseFilePathForS3,
      Body: fileContent,
      ContentType: mimeType,
    }).promise();

    console.log(`Uploaded `, relativeToBaseFilePathForS3);

    return;
  }

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
      Bucket: s3BucketName + (destFolder === "./" ? "" : "/" + destFolder),
      Key: relativeToBaseFilePathForS3,
      Body: fileContent,
      ContentType: mimeType,
    }).promise();

    console.log(`Uploaded `, statistics, relativeToBaseFilePathForS3);

  }
};

const cleanDest = async ({ accessKeyId, secretAccessKey, s3BucketName, srcFolder, destFolder, region }) => {

  AWS.config.setPromisesDependency(Promise);
  AWS.config.update({ "accessKeyId": accessKeyId, "secretAccessKey": secretAccessKey, "region": region });

  const s3 = new AWS.S3();

  console.log("Cleaning Bucket ", s3BucketName);

  const listParams = {
    Bucket: s3BucketName,
    Prefix: (destFolder === "./" ? "" : destFolder)
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: s3BucketName,
    Delete: { Objects: [] }
  };

  listedObjects.Contents.forEach(({ Key }) => {
    console.log("Deleting ", Key);
    deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await cleanDest(config);

};

//Clean Destination first
if (cleanFirst) {
  cleanDest(config).then(function () {
    console.log("Cleaned Bucket ", config.s3BucketName);

    //Start copying after clean
    startUpload(config).then(() => {
      console.log(`Completed!`);
    });
  });
} else {
  startUpload(config).then(() => {
    console.log(`Completed!`);
  });
}


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
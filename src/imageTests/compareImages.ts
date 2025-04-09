import { readdirSync, readFileSync } from "fs";
import path from "path";
import pixelmatch from "pixelmatch";

import { PNG } from "pngjs";

export const DIFF_DIR_NAME = "difference";

import {
  REFERENCE_DIR_NAME,
  CURRENT_DIR_NAME,
  createDirIfNonExistent,
  log,
  VisualTestCase,
  writeImageToFile,
} from "src/imageTests/common";

const getImage = async (imagePath: string) => {
  const buffer = readFileSync(imagePath);
  const pngImage = await PNG.sync.read(buffer);
  return pngImage;
};

const getReferenceImages = async (parentDir: string) => {
  return await readdirSync(path.join(parentDir, REFERENCE_DIR_NAME));
};

const saveDiffImage = async (
  diffImage: PNG,
  testCase: VisualTestCase,
  refImageName: string
) => {
  const { parentDir, jsonFilename } = testCase;

  log(
    `Image comparison failed: images for ${refImageName} of ${jsonFilename} are not equal\n`,
    "error"
  );

  const diffImageOutputDir = path.join(parentDir, DIFF_DIR_NAME);
  createDirIfNonExistent(diffImageOutputDir);

  const diffImageOutputPath = path.join(
    diffImageOutputDir,
    `diff.${refImageName}`
  );

  log(
    `Look at diff image stored in ${diffImageOutputPath} to see more detail\n`,
    "info"
  );

  await writeImageToFile(diffImage, diffImageOutputPath);
};

const getImagePath = (
  parentDir: string,
  testDir: string,
  imageName: string
) => {
  return path.join(parentDir, testDir, imageName);
};

const getReferenceImagePath = (parentDir: string, imageName: string) => {
  return getImagePath(parentDir, REFERENCE_DIR_NAME, imageName);
};

const getCurrentImagePath = (parentDir: string, imageName: string) => {
  return getImagePath(parentDir, CURRENT_DIR_NAME, imageName);
};

const getCurrentImage = async (parentDir: string, imageName: string) => {
  const actualImagePath = await getCurrentImagePath(parentDir, imageName);
  return await getImage(actualImagePath);
};

const getReferenceImage = async (parentDir: string, imageName: string) => {
  const actualImagePath = await getReferenceImagePath(parentDir, imageName);
  return await getImage(actualImagePath);
};

const compareImage = (expectedImage: PNG, actualImage: PNG) => {
  const { width: expectedWidth, height: expectedHeight } = expectedImage;
  const { width: actualWidth, height: actualHeight } = actualImage;

  // create diff image for pixelmatch diff image output (otputs a new image with pixel differences)
  const diffImage = new PNG({ width: actualWidth, height: actualHeight });

  const diffOptions = {
    threshold: 0,
  };
  const numDiffPixels = pixelmatch(
    expectedImage.data,
    actualImage.data,
    diffImage.data,
    expectedWidth,
    expectedHeight,
    diffOptions
  );

  return { numDiffPixels, diffImage };
};

export const compareTestCase = async (
  testCase: VisualTestCase,
  refImageName: string
) => {
  const { parentDir } = testCase;
  const actualImage = await getCurrentImage(parentDir, refImageName);
  const expectedImage = await getReferenceImage(parentDir, refImageName);

  console.log("COMPARING IMAGE: ", refImageName);
  const { numDiffPixels, diffImage } = compareImage(actualImage, expectedImage);

  const imageAreEqual = numDiffPixels === 0;

  if (!imageAreEqual) {
    await saveDiffImage(diffImage, testCase, refImageName);
  }

  return imageAreEqual;
};

export const compareTestCases = async (testCase: VisualTestCase) => {
  const { parentDir } = testCase;

  const referenceImagesNames = await getReferenceImages(parentDir);

  let allImagesAreEqual = true;
  for (const refImageName of referenceImagesNames) {
    const imageIsEqual = await compareTestCase(testCase, refImageName);

    if (!imageIsEqual) {
      allImagesAreEqual = false;
    }
  }

  return allImagesAreEqual;
};

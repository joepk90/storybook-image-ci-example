import { readdirSync, readFileSync, writeFileSync } from "fs";
// import looksSame from "looks-same";
import path from "path";
import pixelmatch from "pixelmatch";

import { PNG } from "pngjs";

export const DIFF_DIR_NAME = "difference";

import {
  REFERENCE_DIR_NAME,
  ACTUAL_DIR_NAME,
  createDirIfNonExistent,
  log,
  VisualTestCase,
} from "src/imageTests/common";

const getReferenceImages = async (parentDir: string) => {
  return await readdirSync(path.join(parentDir, REFERENCE_DIR_NAME));
};

const getImage = async (imagePath: string) => {
  const buffer = readFileSync(imagePath);
  const pngImage = await PNG.sync.read(buffer);
  return pngImage;
};

export const compareTestCase = async (testCase: VisualTestCase) => {
  const { parentDir, jsonFilename } = testCase;

  const referenceImagesNames = await getReferenceImages(parentDir);

  let allImagesAreEqual = true;

  referenceImagesNames.forEach(async (refImageName) => {
    const expectedImagePath = path.join(
      parentDir,
      REFERENCE_DIR_NAME,
      refImageName
    );

    const actualImagePath = path.join(parentDir, ACTUAL_DIR_NAME, refImageName);

    const expectedImage = await getImage(expectedImagePath);
    const actualImage = await getImage(actualImagePath);

    const { width, height } = expectedImage;
    const diffImage = new PNG({ width, height });

    console.log("COMPARING IMAGE: ", refImageName);

    const numDiffPixels = pixelmatch(
      expectedImage.data,
      actualImage.data,
      diffImage.data,
      width,
      height
    );

    if (numDiffPixels !== 0) {
      allImagesAreEqual = false;

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

      const buffer = new Uint8Array(PNG.sync.write(diffImage));
      await writeFileSync(diffImageOutputPath, buffer);
    }
  });

  return allImagesAreEqual;
};

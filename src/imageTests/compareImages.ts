import { readdirSync, readFileSync, writeFileSync } from "fs";
// import looksSame from "looks-same";
import path from "path";
import pixelmatch from "pixelmatch";

import { PNG } from "pngjs";

import {
  createDirIfNonExistent,
  log,
  VisualTestCase,
} from "src/imageTests/common";

export const compareImages = async (testCase: VisualTestCase) => {
  const { parentDir, jsonFilename } = testCase;

  const testImageFiles = readdirSync(path.join(parentDir, "expected"));

  let allImagesAreEqual = true;

  testImageFiles.forEach((imageFilename) => {
    const expectedImagePath = path.join(parentDir, "expected", imageFilename);
    const actualImagePath = path.join(parentDir, "actual", imageFilename);

    const expectedImage = PNG.sync.read(readFileSync(expectedImagePath));
    const actualImage = PNG.sync.read(readFileSync(actualImagePath));

    const { width, height } = expectedImage;
    const diffImage = new PNG({ width, height });

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
        `Image comparison failed: images for ${imageFilename} of ${jsonFilename} are not equal\n`,
        "error"
      );

      const diffImageOutputDir = path.join(parentDir, "diff");
      createDirIfNonExistent(diffImageOutputDir);

      const diffImageOutputPath = path.join(
        diffImageOutputDir,
        `diff.${imageFilename}`
      );

      log(
        `Look at diff image stored in ${diffImageOutputPath} to see more detail\n`,
        "info"
      );

      const buffer = new Uint8Array(PNG.sync.write(diffImage));
      writeFileSync(diffImageOutputPath, buffer);
    }
  });

  return allImagesAreEqual;
};

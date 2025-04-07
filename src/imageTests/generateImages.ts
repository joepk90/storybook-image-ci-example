import { getAllTestCases } from "src/imageTests/common";
import path from "path";
import {
  generateImageWithBackground,
  readJsonFile,
  writeImageToFile,
  createDirIfNonExistent,
} from "src/imageTests/common";

const REFERENCE_DIR_NAME = "reference";

const generateImages = async () => {
  const testCases = await getAllTestCases();

  testCases.forEach((testCase) => {
    const option = readJsonFile(testCase.path);
    const png = generateImageWithBackground(option);
    const pngName = testCase.jsonFilename.replace("json", "png");

    const referenceDirectory = path.join(
      testCase.parentDir,
      REFERENCE_DIR_NAME
    );

    // create directory if it doesn't exist
    createDirIfNonExistent(referenceDirectory);

    // write file to directory
    const referencePath = path.join(referenceDirectory, pngName);
    writeImageToFile(png, referencePath);
  });
};

generateImages();

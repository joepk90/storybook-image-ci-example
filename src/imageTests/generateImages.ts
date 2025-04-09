import { getAllTestCases } from "src/imageTests/common";
import path from "path";
import {
  generateImageWithBackground,
  readJsonFile,
  writeImageToFile,
  createDirIfNonExistent,
} from "src/imageTests/common";

/**
 * generateImages Function:
 *
 * Generates images to a target directory within the .imageTests directory.
 * @param outputDir
 */
export const generateImages = async (outputDir: string) => {
  const testCases = await getAllTestCases();

  console.log("GENERATING IMAGES STARTED");
  return await Promise.all(
    testCases.map(async (testCase) => {
      console.log("GENERATING IMAGE: ", testCase.jsonFilename);

      const option = readJsonFile(testCase.path);
      const png = generateImageWithBackground(option);
      const pngName = testCase.jsonFilename.replace("json", "png");

      const outputDirectory = path.join(testCase.parentDir, outputDir);

      // create directory if it doesn't exist
      createDirIfNonExistent(outputDirectory);

      // write file to directory
      const referencePath = path.join(outputDirectory, pngName);
      await writeImageToFile(png, referencePath);
    })
  );
};

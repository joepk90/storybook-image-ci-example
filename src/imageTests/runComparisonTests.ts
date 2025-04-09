import assert from "node:assert";
import { describe, it } from "node:test";
import {
  getAllTestCases,
  VisualTestCase,
  ACTUAL_DIR_NAME,
} from "src/imageTests/common";
import { compareTestCase } from "src/imageTests/compareImages";
import { generateImages } from "src/imageTests/generateImages";

describe("Image Regression Tests", async () => {
  await generateImages(ACTUAL_DIR_NAME);

  const testCases = await getAllTestCases();
  console.log("=== COMPARING IMAGES ===");
  testCases.forEach(async (testCase: VisualTestCase) => {
    it(`Test PDF images for invoice: ${testCase.jsonFilename}`, async () => {
      const success = await compareTestCase(testCase);

      assert.strictEqual(success, true);
    });
  });
});

import assert from "node:assert";
import { describe, it } from "node:test";
import path from "path";

import { getAllTestCasesInDir } from "src/imageTests/common";
import { compareImages } from "src/imageTests/compareImages";

describe("Image Regression Tests", () => {
  // Optional subpath command line argument
  const subpath = process.argv[2] || "";

  const testCases = getAllTestCasesInDir(
    // path.join(__dirname, "..", "..", "..", "test-cases", subpath)
    path.join(__dirname, "imageTests", subpath)
  );

  testCases.forEach((testCase) => {
    it(`Test PDF images for invoice: ${testCase.jsonFilename}`, async () => {
      const success = await compareImages(testCase);

      assert.strictEqual(success, true);
    });
  });
});

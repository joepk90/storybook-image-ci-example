import { getAllTestCases } from "src/imageTests/common";

const generateImages = async () => {
  const testCases = await getAllTestCases();

  testCases.forEach((testCase) => {
    console.log(testCase);
  });
};

generateImages();

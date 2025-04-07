import { existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { packageDirectory } from "pkg-dir";
import path from "path";

export type VisualTestCase = {
  parentDir: string;
  path: string;
  jsonFilename: string;
};

const LogVariantColorMap = {
  info: "\x1b[34m", // blue
  error: "\x1b[31m", // red
  success: "\x1b[32m", // green
};

type LogVariant = keyof typeof LogVariantColorMap;

export const log = (message: string, variant: LogVariant = "info") => {
  console.log(`${LogVariantColorMap[variant]}%s\x1b[0m`, message);
};

export const createDirIfNonExistent = (dir: string) => {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
};

export const getAllTestCases = async () => {
  const projectRoot = await packageDirectory();

  return getAllTestCasesInDir(path.join(projectRoot as string, "imageTests"));
};

// Recursively searches for json files in given directory (each json file represents one test case)
export const getAllTestCasesInDir = (
  baseDir: string,
  testCasesSoFar: VisualTestCase[] = []
) => {
  const currentDirContent = readdirSync(baseDir);
  let testCases = testCasesSoFar || [];

  currentDirContent.forEach((file) => {
    const newBaseDir = path.join(baseDir, file);

    if (statSync(newBaseDir).isDirectory()) {
      testCases = getAllTestCasesInDir(newBaseDir, testCases);
    } else if (path.extname(file) === `.json`) {
      testCases.push({
        parentDir: baseDir,
        path: newBaseDir,
        jsonFilename: file,
      });
    }
  });

  return testCases;
};

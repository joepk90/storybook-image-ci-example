import { existsSync, mkdirSync, readdirSync, statSync } from "fs";
import * as fs from "fs";
import { packageDirectory } from "pkg-dir";
import path from "path";
import { PNG } from "pngjs";

export const CURRENT_DIR_NAME = "current";
export const REFERENCE_DIR_NAME = "reference";
const IMAGE_TEST_DIR = ".imageTests";

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

  // Optional subpath command line argument
  const subpath = process.argv[2] || "";

  return getAllTestCasesInDir(
    path.join(projectRoot as string, IMAGE_TEST_DIR, subpath)
  );
};

export const readJsonFile = (path: string) => {
  if (!fs.existsSync(path)) {
    console.warn(`JSON file not found at ${path}`);
  }

  return JSON.parse(fs.readFileSync(path, "utf-8"));
};

export const hexToRgb = (hex: string) => {
  const result = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!result) {
    throw new Error("Invalid HEX color");
  }
  const r = parseInt(result[1].substring(0, 2), 16);
  const g = parseInt(result[1].substring(2, 4), 16);
  const b = parseInt(result[1].substring(4, 6), 16);
  return { r, g, b };
};

type ImageOptions = {
  width: number;
  height: number;
  color: string;
};

export const populatePixels = (png: PNG, options: ImageOptions): PNG => {
  const { width, height, color: hexColor } = options;
  const { r, g, b } = hexToRgb(hexColor);

  // Create a buffer for the image with all pixels set to the same color
  const color = [r, g, b, 255]; // RGBA (fully opaque)
  const pixelCount = width * height;
  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    png.data[idx] = color[0]; // Red channel
    png.data[idx + 1] = color[1]; // Green channel
    png.data[idx + 2] = color[2]; // Blue channel
    png.data[idx + 3] = color[3]; // Alpha (fully opaque)
  }

  return png;
};

export const writeImageToFile = async (png: PNG, path: string) => {
  return await new Promise<void>((resolve, reject) => {
    const stream = png.pack().pipe(fs.createWriteStream(path));
    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));
  });
};

export const generateImageWithBackground = (options: ImageOptions): PNG => {
  const { width, height } = options;

  const png = new PNG({
    width,
    height,
    filterType: -1,
  });

  return populatePixels(png, options);
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

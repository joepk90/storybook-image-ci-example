const config = {
    configurations: {
      "chrome.laptop": {
        target: "chrome.app",
        width: 1366,
        height: 768,
      },
    },
    outputDir: process.env.LOKI_OUTPUT_DIR || './loki-images',
  }

  module.exports = config; // Use `module.exports` instead of `export default`
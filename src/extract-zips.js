// extract-zips.js
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

/**
 * 
 * @param {string} zipFilePath 
 * @param {string} destDir 
 * @param {string[]} logs 
 * @returns {string[]}
 */
function extractZipFlat(zipFilePath, destDir, logs = []) {
  const zip = new AdmZip(zipFilePath);
  const entries = zip.getEntries();

  entries.forEach((entry) => {
    if (entry.isDirectory) return;
    const fileName = path.basename(entry.entryName);
    const outputFile = path.join(destDir, fileName);
    if (fs.existsSync(outputFile)) {
      const existingFile = fs.statSync(outputFile);
      if (existingFile.size === entry.getData().length) {
        logs.push(`⚠️ Skipping duplicate file: ${fileName}`);
        return;
      }
    }
    fs.writeFileSync(outputFile, entry.getData());
    logs.push(`✅ Extracted file: ${fileName}`);
  });

  logs.push(`✅ Extracted ${path.basename(zipFilePath)} → ${destDir}`);
}
/**
 * Extracts a ZIP file or a directory of ZIP files into a destination directory
 * @param {string} inputPath 
 * @param {string} outputDir 
 * @returns {string[]}
 */
async function extractZips(inputPath, outputDir) {
  const logs = [];

  const stats = fs.statSync(inputPath);

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  if (stats.isFile() && inputPath.endsWith(".zip")) {
    extractZipFlat(inputPath, outputDir, logs);
  } else if (stats.isDirectory()) {
    const files = fs.readdirSync(inputPath).filter((f) => f.endsWith(".zip"));
    for (const file of files) {
      extractZipFlat(path.join(inputPath, file), outputDir, logs);
    }
  } else {
    throw new Error("Invalid input path");
  }

  return logs;
}

module.exports = { extractZips };

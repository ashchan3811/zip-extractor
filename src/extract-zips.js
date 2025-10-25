const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

/**
 * Extracts a ZIP file or a directory of ZIP files into a destination directory
 * @param {string} inputPath 
 * @param {string} outputBaseDir 
 * @param {boolean} keepStructure 
 * @returns {string[]}
 */
async function extractZips(inputPath, outputBaseDir, keepStructure = false) {
  const logs = [];

  if (!fs.existsSync(outputBaseDir)) {
    fs.mkdirSync(outputBaseDir, { recursive: true });
    logs.push(`📁 Created output directory: "${outputBaseDir}"`);
  }

  function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  function extractZip(zipFilePath) {
    try {
      const zip = new AdmZip(zipFilePath);
      const entries = zip.getEntries();

      for (const entry of entries) {
        if (entry.isDirectory) continue;

        let targetPath;
        if (keepStructure) {
          // Preserve internal folder hierarchy
          targetPath = path.join(outputBaseDir, entry.entryName);
        } else {
          // Flatten: only filenames, no nested paths
          targetPath = path.join(outputBaseDir, path.basename(entry.entryName));
        }

        ensureDir(targetPath);
        fs.writeFileSync(targetPath, entry.getData());
        logs.push(`✅ Extracted file: ${entry.entryName}`);
      }

      logs.push(`✅ Extracted "${path.basename(zipFilePath)}"`);
    } catch (err) {
      logs.push(`❌ Failed to extract "${zipFilePath}": ${err.message}`);
    }
  }

  const stats = fs.statSync(inputPath);

  if (stats.isFile() && inputPath.endsWith(".zip")) {
    extractZip(inputPath);
  } else if (stats.isDirectory()) {
    const files = fs.readdirSync(inputPath).filter((f) => f.endsWith(".zip"));
    for (const file of files) {
      extractZip(path.join(inputPath, file));
    }
  } else {
    throw new Error("Invalid path — must be a zip file or folder containing zips.");
  }

  return logs;
}

module.exports = { extractZips };

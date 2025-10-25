const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

/**
 * Extracts a ZIP file or a directory of ZIP files into a destination directory
 * @param {string} inputPath 
 * @param {string} outputBaseDir 
 * @param {boolean} keepStructure 
 * @param {Function} progressCallback - Called with progress updates
 * @returns {string[]}
 */
async function extractZips(inputPath, outputBaseDir, keepStructure = false, progressCallback = null) {
  const logs = [];

  if (!fs.existsSync(outputBaseDir)) {
    fs.mkdirSync(outputBaseDir, { recursive: true });
    logs.push(`📁 Created output directory: "${outputBaseDir}"`);
    if (progressCallback) progressCallback(`📁 Created output directory: "${outputBaseDir}"`);
  }

  function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Helper to yield control back to event loop
  function yieldToEventLoop() {
    return new Promise(resolve => setImmediate(resolve));
  }

  async function extractZip(zipFilePath) {
    try {
      const zip = new AdmZip(zipFilePath);
      const entries = zip.getEntries();
      const zipBaseName = path.basename(zipFilePath);

      if (progressCallback) {
        progressCallback(`⏳ Extracting "${zipBaseName}"...`);
      }

      let fileCount = 0;
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
        
        const logMessage = `✅ Extracted file: ${entry.entryName}`;
        logs.push(logMessage);
        fileCount++;

        // Yield control every 5 files to keep UI responsive
        if (fileCount % 5 === 0) {
          if (progressCallback) {
            progressCallback(logMessage);
          }
          await yieldToEventLoop();
        }
      }

      const successMessage = `✅ Extracted "${zipBaseName}" (${fileCount} files)`;
      logs.push(successMessage);
      if (progressCallback) progressCallback(successMessage);
    } catch (err) {
      const errorMessage = `❌ Failed to extract "${zipFilePath}": ${err.message}`;
      logs.push(errorMessage);
      if (progressCallback) progressCallback(errorMessage);
    }
  }

  const stats = fs.statSync(inputPath);

  if (stats.isFile() && inputPath.endsWith(".zip")) {
    await extractZip(inputPath);
  } else if (stats.isDirectory()) {
    const files = fs.readdirSync(inputPath).filter((f) => f.endsWith(".zip"));
    
    if (progressCallback) {
      progressCallback(`📦 Found ${files.length} ZIP files to extract`);
    }
    
    for (const file of files) {
      await extractZip(path.join(inputPath, file));
      // Yield between ZIP files
      await yieldToEventLoop();
    }
  } else {
    throw new Error("Invalid path — must be a zip file or folder containing zips.");
  }

  return logs;
}

module.exports = { extractZips };

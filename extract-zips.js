// extract-zips.js
const fs =  require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const [, , inputPath, outputBaseDir, filterFiles] = process.argv;

if (!inputPath || !outputBaseDir) {
  console.error(
    "Usage: node extract-zips.js <zip-file-or-folder> <output-directory>"
  );
  process.exit(1);
}

if (filterFiles) {
  console.log(`🔍 Filtering files starting with: "${filterFiles}"`);
}

// Ensure output directory exists
if (!fs.existsSync(outputBaseDir)) {
  console.log(`📁 Creating output directory: "${outputBaseDir}"`);
  fs.mkdirSync(outputBaseDir, { recursive: true });
} else {
  console.log(`⚠️ Output directory "${outputBaseDir}" already exists.`);
}

function extractZip(zipFilePath, destDir) {
  try {
    console.log(`📂 Extracting: "${zipFilePath}" to "${destDir}"`);

    const zip = new AdmZip(zipFilePath);
    const entries = zip.getEntries();

    entries.forEach((entry) => {
      if (entry.isDirectory) return; // skip folders

      const fileName = path.basename(entry.entryName); // remove folder structure
      const outputFile = path.join(destDir, fileName);

      if (fs.existsSync(outputFile)) {
        console.log(`   ⚠️  File already exists: "${outputFile}"`);

        // check if the file is the same
        const fileData = fs.statSync(outputFile);
        if (fileData.size === entry.getData().length) {
          console.log(`   ⚠️  File is the same: "${outputFile}"`);
          return;
        } else {
          console.log(`   ➡️  Overwriting file: "${fileName}"`);
          fs.writeFileSync(outputFile, entry.getData());
        }
      }

      console.log(`   ➡️  Extracting file: "${fileName}"`);
      fs.writeFileSync(outputFile, entry.getData());
    });
    console.log(`✅ Extracted "${path.basename(zipFilePath)}" → "${destDir}"`);
  } catch (err) {
    console.error(`❌ Failed to extract "${zipFilePath}":`, err.message);
  }
}

function processInput(inputPath, outputDir) {
  const stats = fs.statSync(inputPath);

  if (stats.isFile() && inputPath.endsWith(".zip")) {
    console.log("Processing single zip file:", inputPath);
    // Single zip file
    extractZip(inputPath, outputDir);
  } else if (stats.isDirectory()) {
    // Folder with possibly multiple zips
    const files = fs.readdirSync(inputPath);
    const zipFiles = files.filter((f) => f.endsWith(".zip"));

    if (zipFiles.length === 0) {
      console.log("⚠️ No .zip files found in the folder.");
      return;
    }

    console.log(`📦 Found ${zipFiles.length} zip files. Extracting...`);
    for (const zipFile of zipFiles) {
      if (filterFiles && filterFiles.length && !zipFile.startsWith(filterFiles)) {
        continue;
      }
      const fullZipPath = path.join(inputPath, zipFile);
      extractZip(fullZipPath, outputDir);
    }
  } else {
    console.error(
      "❌ Invalid path. Must be a .zip file or a directory containing .zip files."
    );
  }
}

processInput(inputPath, outputBaseDir);

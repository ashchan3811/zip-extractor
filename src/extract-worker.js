const { parentPort, workerData } = require("worker_threads");
const { extractZips } = require("./extract-zips");

// Worker thread to handle extraction without blocking the main thread
(async () => {
  try {
    const { inputPath, outputDir, keepStructure } = workerData;

    // Send progress updates back to main thread
    const progressCallback = (message) => {
      parentPort.postMessage({ type: "progress", message });
    };

    // Perform the extraction
    const logs = await extractZips(inputPath, outputDir, keepStructure, progressCallback);

    // Send completion message
    parentPort.postMessage({ type: "complete", success: true, logs });
  } catch (error) {
    // Send error message
    parentPort.postMessage({ type: "complete", success: false, error: error.message });
  }
})();


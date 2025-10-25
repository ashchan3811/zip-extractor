const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { Worker } = require("worker_threads");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle("select-input", async (_, selectFolders) => {
  const options = {
    properties: selectFolders 
      ? ["openDirectory", "multiSelections"]
      : ["openFile", "multiSelections"],
    filters: selectFolders ? [] : [{ name: "ZIP Files", extensions: ["zip"] }],
  };
  
  const result = await dialog.showOpenDialog(options);
  return result.canceled ? null : result.filePaths;
});

ipcMain.handle("select-output", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("extract-zips", async (event, { inputPath, outputDir, keepStructure }) => {
  return new Promise((resolve) => {
    // Create a worker thread to handle the extraction
    const worker = new Worker(path.join(__dirname, "extract-worker.js"), {
      workerData: { inputPath, outputDir, keepStructure }
    });

    // Listen for messages from the worker
    worker.on("message", (data) => {
      if (data.type === "progress") {
        // Send progress updates to renderer
        event.sender.send("extraction-progress", data.message);
      } else if (data.type === "complete") {
        // Extraction completed
        if (data.success) {
          resolve({ success: true, logs: data.logs });
        } else {
          resolve({ success: false, error: data.error });
        }
        worker.terminate();
      }
    });

    // Handle worker errors
    worker.on("error", (error) => {
      resolve({ success: false, error: error.message });
      worker.terminate();
    });

    // Handle worker exit
    worker.on("exit", (code) => {
      if (code !== 0) {
        resolve({ success: false, error: `Worker stopped with exit code ${code}` });
      }
    });
  });
});

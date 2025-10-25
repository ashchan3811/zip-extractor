const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { extractZips } = require("./extract-zips");

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

ipcMain.handle("select-input", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile", "openDirectory", "multiSelections"],
    filters: [{ name: "ZIP Files", extensions: ["zip"] }],
  });
  return result.canceled ? null : result.filePaths;
});

ipcMain.handle("select-output", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("extract-zips", async (_, { inputPath, outputDir, keepStructure }) => {
  try {
    const logs = await extractZips(inputPath, outputDir, keepStructure);
    return { success: true, logs };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

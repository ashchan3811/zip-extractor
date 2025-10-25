// src/main.js
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { extractZips } = require("./extract-zips");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "renderer.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // 👇 load the correct path for index.html
  win.loadFile(path.join(__dirname, "index.html"));
}

ipcMain.handle("select-folder", async (_, type) => {
  const result = await dialog.showOpenDialog({
    properties: [type === "input" ? "openFile" : "openDirectory"],
    filters: type === "input" ? [{ name: "ZIP Files", extensions: ["zip"] }] : undefined,
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle("extract-zips", async (_, { inputPath, outputPath }) => {
  try {
    const logs = await extractZips(inputPath, outputPath);
    return { success: true, logs };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

app.whenReady().then(createWindow);

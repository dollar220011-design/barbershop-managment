const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const dataDir = path.join(app.getPath("userData"), "data");
const dataFile = path.join(dataDir, "barbershop.json");

const defaultData = {
  version: 1,
  user: {
    username: "admin",
    passwordHash: crypto.createHash("sha256").update("1234").digest("hex")
  },
  shop: {
    name: "Barber Shop",
    currency: "AUD"
  },
  employees: [],
  services: [
    { id: "s1", name: "Haircut", price: 30, duration: 30 },
    { id: "s2", name: "Beard", price: 20, duration: 20 },
    { id: "s3", name: "Hair + Beard", price: 45, duration: 45 }
  ],
  sales: [],
  expenses: []
};

function ensureData() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2), "utf8");
  }
}

function readData() {
  ensureData();
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2), "utf8");
    return structuredClone(defaultData);
  }
}

function writeData(data) {
  ensureData();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf8");
  return true;
}

function hash(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#101216",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    },
    autoHideMenuBar: true,
    title: "Barber Shop Management"
  });
  win.loadFile(path.join(__dirname, "src", "index.html"));
}

app.whenReady().then(() => {
  ensureData();

  ipcMain.handle("auth:login", (_event, { username, password }) => {
    const data = readData();
    return data.user.username === username && data.user.passwordHash === hash(password);
  });

  ipcMain.handle("auth:changePassword", (_event, { oldPassword, newPassword }) => {
    const data = readData();
    if (data.user.passwordHash !== hash(oldPassword)) return { ok: false, error: "Old password is incorrect." };
    if (!newPassword || String(newPassword).length < 4) return { ok: false, error: "Password must be at least 4 characters." };
    data.user.passwordHash = hash(newPassword);
    writeData(data);
    return { ok: true };
  });

  ipcMain.handle("data:get", () => readData());
  ipcMain.handle("data:save", (_event, data) => writeData(data));

  ipcMain.handle("backup:export", async () => {
    const result = await dialog.showSaveDialog({
      title: "Backup Barber Shop data",
      defaultPath: "barbershop-backup.json",
      filters: [{ name: "JSON", extensions: ["json"] }]
    });
    if (result.canceled || !result.filePath) return { ok: false };
    fs.copyFileSync(dataFile, result.filePath);
    return { ok: true, filePath: result.filePath };
  });

  ipcMain.handle("backup:import", async () => {
    const result = await dialog.showOpenDialog({
      title: "Restore Barber Shop backup",
      properties: ["openFile"],
      filters: [{ name: "JSON", extensions: ["json"] }]
    });
    if (result.canceled || !result.filePaths[0]) return { ok: false };
    try {
      const imported = JSON.parse(fs.readFileSync(result.filePaths[0], "utf8"));
      if (!imported.user || !Array.isArray(imported.sales)) throw new Error("Invalid backup");
      writeData(imported);
      return { ok: true };
    } catch {
      return { ok: false, error: "Invalid backup file." };
    }
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
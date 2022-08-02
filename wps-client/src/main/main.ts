/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import { PowerShell } from 'node-powershell';
import logger from 'loglevel';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const childProcessExecution = require('child_process').execFileSync;

// TO DO
const cmdExePath = `${process.env.LOCALAPPDATA}\\Programs\\wps-dashboard\\resources\\assets\\exe\\DownloadGame.exe`;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// async function executePS() {
//   const ps = new PowerShell({
//     debug: true,
//     executableOptions: {
//       '-ExecutionPolicy': 'Bypass',
//       '-NoProfile': true,
//     },
//   });

//   const string1 = `${process.env.LOCALAPPDATA}\\Programs\\wps-game`;

//   // try {
//   const message = 'hey from node-powershell <3';
//   const printCommand = PowerShell.command`Write-Host ${message} -ForegroundColor red -BackgroundColor white`;
//   await ps.invoke(printCommand);
//   const printCommand2 = PowerShell.command`Test-Path -Path ${string1}`;
//   const pathResult = await ps.invoke(printCommand2);
//   console.log(
//     printCommand2,
//     pathResult,
//     pathResult.raw,
//     pathResult.raw === 'False'
//   );
//   if (pathResult.raw === 'False') {
//     console.log('hello from frommmm');
//     const printCommand1 = PowerShell.command`New-Item ${string1} -itemType Directory`;
//     const createPathResult = await ps.invoke(printCommand1);
//     console.log(createPathResult);
//     runCmdExeToGetGameFiles([
//       'https://secrectkeysstorage.vault.azure.net/',
//       'e282c51b-3889-47ce-a0b5-4a603cdb731c',
//       'b300d330-0e9b-4fba-bec7-4e043230276f',
//       's3N8Q~Hkdd2~9SnaTqFeb0NNCal620ys.H3Ioc-t',
//       'constants',
//       'wps-game.zip',
//       // TO DO
//       `${process.env.LOCALAPPDATA}\\Programs\\wps-game`,
//       // `E:\\Test`,
//     ]);
//   }

//   // const scriptCommand = PowerShell.command`. .\\script.ps1`;
//   // const result = await ps.invoke(scriptCommand);
//   // console.log(result);
//   // const scriptCommand = PowerShell.command`. ./script.ps1 -message ${message}`;
//   // const result = await ps.invoke(scriptCommand);
//   // console.log(result);
//   // } catch (error) {
//   //   console.error(error);
//   // } finally {
//   //   await ps.dispose();
//   // }
// }

// // executePS();

// async function runCmdExeToGetGameFiles(parameters: any) {
//   dialog.showMessageBox({
//     title: 'WPS by Hatch',
//     type: 'info',
//     message: 'Downloading game, Please wait. \r\n',
//   });
//   await childProcessExecution(
//     cmdExePath,
//     parameters,
//     {
//       shell: true,
//       windowsHide: true,
//     },
//     (error: any, stdout: any, stderr: any) => {
//       if (error) {
//         // throw error;
//       }
//       console.log(stdout);
//       if (error) {
//         console.log(error, 'Powershell error');
//       }
//       if (stdout) {
//         console.log(stdout, 'Powershell data');
//       }
//       if (stderr) {
//         console.log(stderr, 'Powershell data');
//       }
//     }
//   );
//   dialog.showMessageBox({
//     title: 'WPS by Hatch',
//     type: 'info',
//     message: 'Download Complete. \r\n',
//   });
// }

logger.setLevel('trace');

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'qa' ||
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'developmentstart' ||
  process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, 'assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      devTools: false,
    },
    fullscreen: true,
    frame: false,
    kiosk: true,
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  callIpcMethods(mainWindow);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

function callIpcMethods(mainWindow: BrowserWindow) {
  // Event handler for synchronous incoming messages
  // ipcMain.on('test-message', (_event, arg) => {
  //   logger.debug(arg);

  //   if (mainWindow) {
  //     mainWindow.loadFile(
  //       // uncomment below line of code while packaging the application
  //       path.join(
  //         __dirname,
  //         '../../../../../wps-game/wps-game/build/index.html'
  //       )

  //       // uncomment below line of code while serving the application
  //       // path.join(__dirname, '../../../wps-game/build/index.html')
  //     );
  //   }
  // });

  ipcMain.on('close_application', (event, arg) => {
    logger.debug(arg);
    if (arg[0] === 'close_application') {
      mainWindow?.close();
    }
  });

  ipcMain.on('game-to-electron', (_event, arg) => {
    logger.debug(arg);
    if (mainWindow) {
      mainWindow.loadURL(resolveHtmlPath('index.html'));
    }
  });

  ipcMain.on('ipc-example', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply('ipc-example', msgTemplate('pong'));
  });
}

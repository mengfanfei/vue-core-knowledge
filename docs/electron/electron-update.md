# electron 更新
封装一个updater方法，将版本更新有关的内容整合在一起，在主进程中app.on('ready')时使用
```ts
import { autoUpdater } from 'electron-updater'
import { ipcMain, BrowserWindow, app, globalShortcut, shell } from 'electron'
import path from 'path'
import os from 'os'

const isDevelopment = process.env.NODE_ENV === 'development'
let isUpdateWindowOpening = false
let updateWindow = null as null | BrowserWindow
let latestInfo = {} as any
let downloadPending = false

if (isDevelopment) {
  autoUpdater.updateConfigPath = path.join(__dirname, '../dev-app-update.yml')
}

// todo main暂时需求不确定 BrowserWindow | BrowserView
export default function (main: BrowserWindow, checkUpdate = false) {
  console.log('@当前版本', autoUpdater.currentVersion)
  // 允许开发环境进行更新
  autoUpdater.forceDevUpdateConfig = true
  // 是否自动下载
  autoUpdater.autoDownload = false
  // 是否自动安装
  autoUpdater.autoInstallOnAppQuit = false
  // 是否允许降级
  autoUpdater.allowDowngrade = true

  openUpdateBrowserView(main)

  checkUpdate && autoUpdater.checkForUpdates()

  ipcMain.handle('check-update', () => {
    return autoUpdater.checkForUpdates()
  })

  ipcMain.on('download-update', () => {
    if (downloadPending) return
    downloadPending = true
    autoUpdater.downloadUpdate()
  })
  
  ipcMain.on('do-update', () => {
    console.log('收到退出并更新指令')
    autoUpdater.quitAndInstall()
  })

  ipcMain.on('update-window-ready', () => {
    updateWindow?.webContents.send('update-avaiable', latestInfo)
  })

  ipcMain.on('close-update-window', () => {
    updateWindow?.hide()
  })

  ipcMain.on('update-error-noMacSign', () => {
    const homeDir = os.homedir()
    shell.openPath(`${homeDir}/Library/Caches/gfcity-console-app/pending`)
      .then(error => {
        if (error) {
          console.log('打开目录失败')
        }
      })
  })
  
  autoUpdater.on('checking-for-update', function () {
    console.log('@au 检查更新中')
    // main.webContents.send('update-dispatch', {
    //   prompt: 'checking-for-update',
    // })
  })
  
  autoUpdater.on('error', (error) => {
    console.log('@au 检查更新失败', error)
    downloadPending = false
    // main.webContents.send('update-dispatch', {
    //   prompt: 'error',
    //   data: error
    // })
    updateWindow?.webContents.send('update-error', error)
  })
  
  autoUpdater.on('update-available', (info) => {
    console.log('@au 发现有新版本更新', info.version)
    latestInfo = info
    updateWindow?.show()
  })
  
  autoUpdater.on('update-not-available', () => {
    console.log('@au 当前无版本更新')
    // main.webContents.send('update-dispatch', {
    //   prompt: 'update-not-available'
    // })
  })

  
  autoUpdater.on('download-progress', (prog) => {
    console.log('@au 下载更新中', prog)
    // main.webContents.send('update-dispatch', {
    //   prompt: 'download-progress',
    //   data: {
    //     total: prog.total,
    //     bytesPerSecond: prog.bytesPerSecond,
    //     percent: prog.percent
    //   }
    // })

    updateWindow?.webContents.send('update-downloading', {
      total: prog.total,
      bytesPerSecond: prog.bytesPerSecond,
      percent: prog.percent
    })
  })
  
  autoUpdater.on('update-downloaded', () => {
    downloadPending = false
    console.log('@au 下载更新程序完成')

    // main.webContents.send('update-dispatch', {
      // prompt: 'update-downloaded',
    // })
    updateWindow?.webContents.send('update-downloaded')
  })  
}

/**
 * 打开更新的浏览器窗口
 * @note 当前版本暂时不需要
 */
export function openUpdateBrowserView (parentWindow: BrowserWindow) {
  if (isUpdateWindowOpening) return

  isUpdateWindowOpening = true
  const isMac = process.platform === 'darwin'
  const height = isMac ? 356 + 28 : 356

  updateWindow = new BrowserWindow({
    width: 368,
    height,
    useContentSize: true,
    parent: parentWindow,
    modal: true,
    show: false,
    frame: false,
    transparent: isMac, // windows下启用translate会屏蔽hasShadow
    hasShadow: true, // 默认是true，对应“transparent”属性注释
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  // updateWindow.webContents.openDevTools()

  if (app.isPackaged) {
    updateWindow.loadFile('dist/update.html')
  } else {
    updateWindow.loadURL('http://localhost:14001/update.html')
  }

  globalShortcut.register('CommandOrControl+Shift+h+d', () => {
    updateWindow?.hide()
    updateWindow?.reload() // 按需打开
    isUpdateWindowOpening = false
  })
}
```

然后通过在vue代码中监听不同的状态，展示不同的卡片信息
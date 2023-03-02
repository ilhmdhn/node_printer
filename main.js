const { app, BrowserWindow, Tray, Menu, ipcMain} = require('electron');
const dgram = require('node:dgram');
const {testPrint} = require('./src/controller/printer-controller')
const identity = require('./src/tools/printer-initial');
const {createPrinterAddressTable, registerPrinter} = require('./src/tools/add-table');

const createWindow = () => {
    const server = dgram.createSocket('udp4');
    const win = new BrowserWindow({
        width: 480,
        height: 510,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: __dirname + '/icon.png',
        title: "Thermal Printer Service",
        autoHideMenuBar: true,
        enableRemoteModule: true
    });

    const additionalData = { myKey: 'thermalprinterservices' }
    const gotTheLock = app.requestSingleInstanceLock(additionalData);

    if (!gotTheLock) {
        win == null;
        app.quit();
        return;
    }

    win.focus();
    win.center();
    win.on('closed', (event) => {
        event.preventDefault();
        win.hide();
    })

    win.on('minimize', (event) => {
        event.preventDefault();
        win.hide();
    });

    win.on('close', (event) => {
        event.preventDefault();
        win.hide();
    });

    const tray = new Tray(__dirname + '/icon.png');
    tray.on('click', () => {
        if (win.isVisible()) {
            win.hide();
        } else {
            win.show();
        }
    })
    tray.setTitle('Thermal Printer Service');
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click: function () {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);


    tray.setContextMenu(contextMenu);
    win.loadFile(__dirname+'/src/views/index.html');

    const showPrintRequest = (printnya)=>{
        win.webContents.send('RESULT-PRINT', printnya);
    }

    ipcMain.on('SUBMIT-TEST-PRINT', (event, msg)=>{
        showPrintRequest(testPrint())
    });

    win.webContents.on('did-finish-load', async() => {
        try{
            const printerIdentity = await identity()
            // await createPrinterAddressTable();
            await registerPrinter(printerIdentity);
            win.webContents.send('CONNECTION-PRINTER', 
            {
                state: true,
                message: 'Printer Registered'
            }
        );
        }catch(err){
            win.webContents.send('CONNECTION-PRINTER', 
            {
                state: false,
                message: 'Error '+err
            }
            );
        }

        const printerIdentity = await identity();
        win.webContents.send('INITIAL-PRINTER', 
            {
                name:printerIdentity.name,
                ip:printerIdentity.ipAddress,
                port:printerIdentity.port
            }
        );
    });

    server.on('error', (err) => {
        win.webContents.send('CONNECTION-PRINTER', 
        {
            state: false,
            message: 'Error '+err
        }
        );
        server.close();
      });

    server.on('thermal-print', (msg, sender)=>{
        console.log(sender)
    });

    server.bind(3456);
}

app.whenReady().then(() => {
    createWindow();
});
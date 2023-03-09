const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const { testPrint, printInvoice, manualPrint } = require('./src/controller/printer-controller')
const identity = require('./src/tools/printer-initial');
const { createPrinterAddressTable, registerPrinter,creatOmlTable, createOmdTable } = require('./src/tools/add-table');
const startTimer = require('./src/tools/timer-cek-print-list');

const createWindow = () => {

    const additionalData = { myKey: 'thermalprinterservices' }
    const gotTheLock = app.requestSingleInstanceLock(additionalData);

    if (!gotTheLock) {
        return;
    }

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

    win.loadFile(__dirname + '/src/views/index.html');

    const showPrintRequest = (printnya) => {
        win.webContents.send('RESULT-PRINT', printnya);
    }

    ipcMain.on('SUBMIT-TEST-PRINT', (event, msg) => {
        showPrintRequest(testPrint())
    });

    ipcMain.on('MANUAL-PRINT', async (event, orderCode) => {
        showPrintRequest(await manualPrint(orderCode));
    });

    win.webContents.on('did-finish-load', async () => {
        try {
            const printerIdentity = await identity()
            // await createPrinterAddressTable();
            // await registerPrinter(printerIdentity);
            await creatOmlTable()
            await createOmdTable()
            win.webContents.send('CONNECTION-PRINTER',
                {
                    state: true,
                    message: 'Printer Registered'
                }
            );
        } catch (err) {
            win.webContents.send('CONNECTION-PRINTER',
                {
                    state: false,
                    message: 'Error ' + err
                }
            );
        }

        const printerIdentity = await identity();
        win.webContents.send('INITIAL-PRINTER',
            {
                name: printerIdentity.name,
                ip: printerIdentity.ipAddress,
                port: printerIdentity.port,
                socket: printerIdentity.socket
            }
        );
    });

    startTimer()
}

app.whenReady().then(() => {
    createWindow();
});

//GAJADI MAIN SINYAL

/*

-----TCP-----

const net = require('node:net');

    const socket = net.createServer((client) => {
        console.log('client connected');

        client.on('close', (isClosed) => {
            console.log(`Client closed ${isClosed}`);
        });

        client.on('end', () => {
            console.log('client disconnected');
        });

        client.on('error', (err)=>{
            console.log(`client error ${err}`);
        });

        client.on('data', async(data) => {
            console.log(data.toString())
            const str = data.toString().replace(/^"(.*)"$/, '$1');
            showPrintRequest(await printInvoice(str));
        });

        client.pipe(client);
    });
    socket.listen(3457);


    ----UDP-----
    const dgram = require('node:dgram');
    
    
    const server = dgram.createSocket('udp4');
    server.bind(3456);

        server.on('error', (err) => {
        win.webContents.send('CONNECTION-PRINTER',
            {
                state: false,
                message: 'Error ' + err
            }
        );
        server.close();
    });
    /*
    server.on('message', async(msg, sender)=>{
        msg = JSON.parse(msg.toString());
        console.log(msg.data.invoice);
        showPrintRequest(testPrint())
    });
    
    server.on('message', async (msg, sender) => {
        const str = msg.toString().replace(/^"(.*)"$/, '$1');
        showPrintRequest(await printInvoice(str));
    });

*/
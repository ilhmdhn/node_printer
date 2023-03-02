const sqlConfig = require('../tools/db-configuration');
const sql = require('mssql');

const createPrinterAddressTable = () => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
            IF NOT EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_NAME = 'IHP_Printer_address') Begin
                        CREATE TABLE [dbo].[IHP_Printer_address](
                        [printer_name] [nvarchar](30) PRIMARY KEY NOT NULL,
                        [ip_address] [nvarchar](16) NOT NULL,
                        [port] [nvarchar] (5) NOT NULL)end`
            sql.connect(sqlConfig, err => {
                if (err) {
                    reject(err.message);
                } else {
                    new sql.Request().query(query, (err, result) => {
                        if (err) {
                            reject(err.message);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        } catch (err) {
            reject(err.message);
        }
    });
}

const registerPrinter = (dataPrinter) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
            BEGIN TRAN
            UPDATE IHP_IPAddress with (serializable) SET
               [IP_Address] = '${dataPrinter.ipAddress}',
               [Server_Udp_Port] = '${dataPrinter.port}'
            WHERE [Aplikasi] = '${dataPrinter.name}'
           IF @@rowcount = 0
           BEGIN
                INSERT INTO IHP_IPAddress([Aplikasi] ,[IP_Address],[Server_Udp_Port])
                VALUES (
                    '${dataPrinter.name}',
                    '${dataPrinter.ipAddress}',
                    '${dataPrinter.port}'
                )
            END
            COMMIT TRAN
            `
            sql.connect(sqlConfig, err => {
                if (err) {
                    reject(`Error Connect To Database \n ${err}`)
                } else {
                    new sql.Request().query(query, (err, result) => {
                        if (err) {
                            reject(err.message)
                        } else {
                            resolve('printer registered');
                        }
                    });
                }
            });
        } catch (err) {
            reject(err.message);
        }
    })
}

module.exports = {
    createPrinterAddressTable,
    registerPrinter
}
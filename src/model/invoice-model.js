const sqlConfig = require('../tools/db-configuration');
const sql = require('mssql');

const getOutletInfo = () => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
            SELECT
                Nama_Outlet as outlet_name,
                Alamat_Outlet as outlet_address,
                Alamat_Outlet2 as outlet_second_address,
                Tlp1 as outlet_phone,
                Kota as outlet_city
            FROM 
                [IHP_Config]
            WHERE
                DATA = '1'
        `
            sql.connect(sqlConfig, err => {
                if (err) {
                    reject(`Can't connect to database ${err}`);
                } else {
                    new sql.Request().query(query, (err, result) => {
                        if (err) {
                            reject(`Error getOutletInfo query ${query}\n${err}`);
                        } else {
                            resolve(result.recordset[0]);
                        }
                    });
                }
            });
        } catch (err) {
            reject(`getOutletInfo ${err}`);
        }
    });
}

const getInvoiceInfo = (sellingCode) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
                SELECT
                    [Invoice] as selling_order_code,
                    [Date] as invoice_date,
                    [Nama_Member] as member_name,
                    [Status] as state,
                    [Chuser] as [user]
                FROM
                    IHP_Oml
                WHERE
                    [Invoice] = '${sellingCode}'
            `
            sql.connect(sqlConfig, err => {
                if (err) {
                    reject(`Can't connect to databases ${err}`);
                } else {
                    new sql.Request().query(query, (err, result) => {
                        if (err) {
                            reject(`Error getInvoiceInfo ${err}`);
                        } else {
                            if (result.recordset.length > 0) {
                                resolve(result.recordset[0]);
                            } else {
                                reject('Kode invoice tidak dikenali');
                            }
                        }
                    });
                }
            });
        } catch (err) {
            reject(`getInvoiceInfo ${err}`);
        }
    })
}

const getPromoInfo = (orderCode, itemCode) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
                SELECT
                    [OrderPenjualan] as order_code,
                    [Inventory] as item_code,
                    [Promo_Food] as promo_name,
                    [Harga_Promo] as promo_charge
                FROM
                    [IHP_Jual_Promo]
                WHERE
                    [OrderPenjualan] = '${orderCode}'
                AND
                    [Inventory] = '${itemCode}'
            `;
            sql.connect(sqlConfig, err => {
                if (err) {
                    reject(`Can't connect to database ${err}`);
                } else {
                    new sql.Request().query(query, (err, result) => {
                        if (err) {
                            reject(`Error getPromoInfo query ${query}\n${err}`);
                        } else {
                            if (result.recordset.length > 0) {
                                resolve(result.recordset[0]);
                            } else {
                                resolve(false);
                            }
                        }
                    });
                }
            });
        } catch (err) {
            reject(`getPromoInfo ${err}`);
        }
    });
}

const getItemList = (sellingCode) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
                SELECT
                    [Invoice] as selling_code,
                    [Nama_Item] as item_name,
                    [Harga] as item_price,
                    [Inventory] as inventory,
                    [Service] as item_service,
                    [Pajak] as item_tax,
                    [Diskon] as item_discount,
                    [qty] as item_qty
                FROM
                    IHP_Omd
                WHERE
                    [Invoice] = '${sellingCode}'
            `;
            sql.connect(sqlConfig, err => {
                if (err) {
                    reject(`Can't connect to database ${err}`);
                } else {
                    new sql.Request().query(query, (err, result) => {
                        if (err) {
                            reject(`Error getItemList query ${query}\n${err}`);
                            console.log(`Error getItemList query ${query}\n${err}`);
                        } else {
                            if (result.recordset.length > 0) {
                                resolve(result.recordset);
                            } else {
                                resolve(false);
                            }
                        }
                    });
                }
            })
        } catch (err) {
            reject(`getItemList ${err}`);
        }
    })
}

const getInvoiceDetail = (invoiceCode) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
                SELECT 
                    [Charge_Penjualan] as selling_charge,
                    [Discount_Penjualan] as selling_discount,
                    [Service_Penjualan] as selling_service,
                    [OrderPenjualan] as selling_order_code,
                    [Tax_Penjualan] as selling_tax,
                    [Total_Penjualan] as selling_fix,
                    [Charge_Lain] as selling_other,
                    [Total_All] as selling_all
                FROM
                    IHP_Ivc_Mart
                WHERE
                    [Invoice] = '${invoiceCode}'
            `;
            sql.connect(sqlConfig, err => {
                if (err) {
                    reject(`Can't connect to database ${err}`);
                } else {
                    new sql.Request().query(query, (err, result) => {
                        if (err) {
                            reject(`Error getInvoiceDetail query ${query}\n${err}`);
                        } else {
                            if (result.recordset.length > 0) {
                                resolve(result.recordset[0]);
                            } else {
                                reject('invoice tidak ada');
                            }
                        }
                    });
                }
            });
        } catch (err) {
            reject(`getInvoiceDetail ${err}`);
        }
    });
}

const getBill = (sellingCode) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
                SELECT
                    Summary as bill_code,
                    Total as total,
                    Bayar as bill,
                    Kembali as retur
                FROM 
                    IHP_Bayar
                WHERE
                    OrderPenjualan = '${sellingCode}'
            `;
            sql.connect(sqlConfig, err => {
                if (err) {
                    reject(`Can't connect to database ${err}`);
                } else {
                    new sql.Request().query(query, (err, result) => {
                        if (err) {
                            reject(`Error getBill query ${query}\n${err}`);
                        } else {
                            if (result.recordset.length > 0) {
                                resolve(result.recordset[0]);
                            } else {
                                reject('data pembayaran tidak ada');
                            }
                        }
                    });
                }
            });
        } catch (err) {
            reject(`getBill ${err}`);
        }
    });
}

const getBillDetail = (billCode) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
                SELECT
                    [Nama_Payment] as payment_name,
                    [Pay_Value] as pay_value
                FROM 
                    [IHP_BayarD]
                WHERE
                    [Summary] = '${billCode}'
            `;
            sql.connect(sqlConfig, err => {
                if (err) {
                    reject(`Can't connect to database ${err}`);
                } else {
                    new sql.Request().query(query, (err, result) => {
                        if (err) {
                            reject(`Error getBill query ${query}\n${err}`);
                        } else {
                            if (result.recordset.length > 0) {
                                resolve(result.recordset);
                            } else {
                                reject('data pembayaran tidak ada');
                            }
                        }
                    });
                }
            });
        } catch (err) {
            reject(`getBillDetail ${err}`);
        }
    });
}

const getInvoiceCode = (sellingCode) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `
                SELECT 
                    [Invoice] as invoice
                FROM
                    IHP_Ivc_Mart
                WHERE
                    [OrderPenjualan] = '${sellingCode}'
            `;
            sql.connect(sqlConfig, err => {
                if (err) {
                    reject(`Can't connect to database ${err}`);
                } else {
                    new sql.Request().query(query, (err, result) => {
                        if (err) {
                            reject(`Error getInvoiceCode query ${query}\n${err}`);
                        } else {
                            if (result.recordset.length > 0) {
                                resolve(result.recordset[0].invoice);
                            } else {
                                reject('invoice tidak ada');
                            }
                        }
                    });
                }
            });
        } catch (err) {
            reject(`getInvoiceCode ${err}`);
        }
    });
}

const setPrinted = (orderCode) =>{
    return new Promise((resolve)=>{
        try{
            const query = `
                UPDATE 
                    IHP_Oml 
                SET 
                    Status = 1
                WHERE
                    Invoice = '${orderCode}'
            `;
            sql.connect(sqlConfig, err => {
                if (err) {
                    resolve(`Can't connect to database ${err}`);
                } else {
                    new sql.Request().query(query, (err, result) => {
                        if (err) {
                            resolve(`Error getInvoiceCode query ${query}\n${err}`);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        }catch(err){
            resolve(`setPrinted ${err}`);
        }
    })
}

const getWaitingPrint = () =>{
    return new Promise((resolve, reject)=>{
        try{
            const query = `
                SELECT
                    [Invoice] as order_code
                FROM 
                    IHP_Oml
                WHERE Status = 0
            `;
            sql.connect(sqlConfig, err => {
                if (err) {
                    resolve(false);
                } else {
                    new sql.Request().query(query, (err, result) => {
                        if (err) {
                            resolve(false);
                        } else {
                            if(result.recordset.length > 0){
                                resolve(result.recordset[0].order_code);
                            }else{
                                resolve(false);
                            }
                        }
                    });
                }
            });
        }catch(err){
            resolve(false);
        }
    });
}

module.exports = {
    getOutletInfo,
    getInvoiceInfo,
    getPromoInfo,
    getItemList,
    getInvoiceDetail,
    getBill,
    getBillDetail,
    getInvoiceCode,
    setPrinted,
    getWaitingPrint
}
const sqlConfig = require('../tools/db-configuration');
const sql = require('mssql');

const getOutletInfo = () =>{
    return new Promise((resolve, reject)=>{
        try{
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
        sql.connect(sqlConfig, err=>{
            if(err){
                reject(`Can't connect to database ${err}`);
            }else{
                new sql.Request().query(query, (err, result)=>{
                    if(err){
                        reject(`Error getOutletInfo query ${query}\n${err}`);
                    }else{
                        resolve(result.recordset[0]);
                    }
                });
            }});
        }catch(err){
            reject(`getOutletInfo ${err}`);
        }
    });
}

const getInvoiceInfo = (invoiceCode) =>{
    return new Promise((resolve, reject)=>{
        try{
            const query = `
                SELECT
                    [Invoice] as invoice_code,
                    [Date] as invoice_date,
                    [OrderPenjualan] as selling_order_code,
                    [Nama_Member] as member_name,
                    [Status] as state,
                    [Chuser] as user
                FROM
                    IHP_Oml
                WHERE
                    [Invoice] = '${invoiceCode}'
            `
            sql.connect(sqlConfig, err=>{
                if(err){
                    reject(`Can't connect to databases ${err}`);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            reject(`Error getInvoiceInfo ${err}`);
                        }else{
                            if(result.recordset.length>0){
                                resolve(result.recordset[0]);
                            }else{
                                reject('Kode invoice tidak dikenali');
                            }
                        }
                    });
                }
            });
        }catch(err){
            reject(`getInvoiceInfo ${err}`);
        }
    })
}

const getPromoInfo = (orderCode, itemCode) =>{
    return new Promise((resolve, reject)=>{
        try{
            const query = `
                SELECT
                    [OrderPenjualan] as order_code,
                    [Inventory] as item_code,
                    [Promo_Food] as promo_name
                    [Harga_Promo] as promo_charge
                FROM
                    [IHP_Jual_Promo]
                WHERE
                    [OrderPenjualan] = '${orderCode}'
                AND
                    [Inventory] = '${itemCode}'
            `;
            sql.connect(sqlConfig, err=>{
                if(err){
                    reject(`Can't connect to database ${err}`);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            reject(`Error getPromoInfo query ${query}\n${err}`);
                        }else{
                            if(result.recordset.length>0){
                                resolve(result.recordset);
                            }else{
                                resolve(false);
                            }
                        }
                    });
                }
            });
        }catch(err){
            reject(`getPromoInfo ${err}`);
        }
    });
}

const getItemList = (invoiceCode) =>{
    return new Promise((resolve, reject)=>{
        try{
            const query = `
                SELECT
                    [Nama_Item] as item_name,
                    [Harga] as item_price,
                    [Service] as item_service,
                    [Pajax] as item_tax,
                    [Diskon] as item_discount,
                    [qty] as item_qty
                FROM
                    IHP_Omd
                WHERE
                    [Invoice] = '${invoiceCode}'
            `
            sql.connect(sqlConfig, err=>{
                if(err){
                    reject(`Can't connect to database ${err}`);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            reject(`Error getItemList query ${query}\n${err}`);
                        }else{
                            if(result.recordset.length>0){
                                resolve(result.recordset);
                            }else{
                                resolve(false);
                            }
                        }
                    });
                }
            })
        }catch(err){
            reject(`getItemList ${err}`);
        }
    })
}

const getInvoiceDetail = (invoiceCode) =>{
    return new Promise((resolve, reject)=>{
        try{
            const query = `
                SELECT 
                    [Charge_Penjualan] as selling_charge,
                    [Discount_Penjualan] as selling_discount,
                    [Service_Penjualan] as selling_service,
                    [Tax_Penjualan] as selling_tax,
                    [Total_Penjualan] as selling_fix,
                    [Charge_Lain] as selling_other,
                    [Total_All] as selling_all
                FROM
                    IHP_Ivc_Mart
                WHERE
                    [Invoice] = '${invoiceCode}'
            `;
            sql.connect(sqlConfig, err=>{
                if(err){
                    reject(`Can't connect to database ${err}`);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            reject(`Error getInvoiceDetail query ${query}\n${err}`);
                        }else{
                            if(result.recordset.length>0){
                                resolve(result.recordset[0]);
                            }else{
                                reject('invoice tidak ada');
                            }
                        }
                    });
                }
            });
        }catch(err){
            reject(`getInvoiceDetail ${err}`);
        }
    });
}

module.exports = {
    getOutletInfo,
    getInvoiceInfo,
    getPromoInfo,
    getItemList,
    getInvoiceDetail
}
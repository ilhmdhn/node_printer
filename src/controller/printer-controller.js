const escpos = require('escpos');
const path = require('path');
escpos.USB = require('escpos-usb');

const {
  getOutletInfo,
  getInvoiceInfo,
  getPromoInfo,
  getItemList,
  getInvoiceDetail
} = require('../model/invoice-model');

const testPrint = ()=>{
    try{
        const options = { encoding: "GB18030" /* default */ };
        const device = new escpos.USB();
        const printer = new escpos.Printer(device, options);
        device.open((err) => {
            if(err){
              return  {
                state: false,
                message: err.message
              }
            }else{
                printer.newLine()
                    .align('ct')
                escpos.Image.load(path.join(__dirname, '../assets/tb_ori.png'), (image) => {
                    printer.image(image) .then(() => { 
                        printer.font('a')
                        .size(0.1, 1)
                        .newLine()
                        .newLine()
                        .style('NORMAL')
                        .text('JLN RAYA DARMO PERMAI SELATAN 1A - 18')
                        .text('SURABAYA')
                        .text('(031)-7310867')
                        .newLine()
                        // .size(1, 0.1)
                        .text('Check: 3')
                        // .size(0.1, 1)
                        .tableCustom(
                            [
                              { text:"PAX: 1", align:"LEFT", width:0.5},
                              { text:"OP: Indah", align:"RIGHT", width:0.5}
                            ],
                            {size: [1, 1] } // Optional
                          )
                        .tableCustom(
                            [
                              { text:"POS Title: DP", align:"LEFT", width:0.5},
                              { text:"POS: POS012", align:"RIGHT", width:0.5}
                            ],
                            {size: [1, 1] } // Optional
                        )
                        .tableCustom(
                            [
                              { text:"Rcpt#: K2200061772", align:"LEFT", width:0.5},
                              { text:"14/02/2023 11:26", align:"RIGHT", width:0.5}
                            ],
                            {size: [1, 1] } // Optional
                        )
                        .style('B')
                        .text('-----------------------------------------------')
                        .style('NORMAL')
                        .tableCustom(
                            [
                              { text:" 1 DONAT SATE MUISJES", align:"LEFT", width:0.75},
                              { text:"16.000", align:"RIGHT", width:0.25}
                            ],
                            {size: [1, 1] } // Optional
                          )
                        .tableCustom(
                            [
                              { text:" 1 KROKET AYAM JAMUR", align:"LEFT", width:0.75},
                              { text:"16.000", align:"RIGHT", width:0.25}
                            ],
                            {size: [1, 1] } // Optional
                        )
                        .tableCustom(
                            [
                              { text:" 1 LUMPIA BASAH MIKA", align:"LEFT", width:0.75},
                              { text:"23.000", align:"RIGHT", width:0.25}
                            ],
                            {size: [1, 1] } // Optional
                        )
                        .tableCustom(
                            [
                              { text:" 2 PASTEL SUN", align:"LEFT", width:0.75},
                              { text:"30.000", align:"RIGHT", width:0.25}
                            ],
                            {size: [1, 1] } // Optional
                        )
                        .style('B')
                        .text('-----------------------------------------------')
                        .style('NORMAL')
                        .tableCustom(
                            [
                              { text:"   SUBTOTAL", align:"LEFT", width:0.75},
                              { text:"85.000", align:"RIGHT", width:0.25}
                            ],
                            {size: [1, 1] } // Optional
                        )
                        .tableCustom(
                            [
                              { text:"   Inc. PPN 11%", align:"LEFT", width:0.75},
                              { text:"8.423", align:"RIGHT", width:0.25}
                            ],
                            {size: [1, 1] } // Optional
                        )
                        .style('B')
                        .text('-----------------------------------------------')
                        .style('NORMAL')
                        .tableCustom(
                            [
                              { text:"   TOTAL", align:"LEFT", width:0.75},
                              { text:"85.000", align:"RIGHT", width:0.25}
                            ],
                            {size: [1, 1] } // Optional
                        )
                        .tableCustom(
                            [
                              { text:"   SUBTOTAL", align:"LEFT", width:0.75},
                              { text:"85.000", align:"RIGHT", width:0.25}
                            ],
                            {size: [1, 1] } // Optional
                        )
                        .style('B')
                        .text('==============================================')
                        .style('NORMAL')
                        .text('Closed Bill')
                        .text('<--------------24/02/2023 13:34--------------->')
                        .text('TERIMA KASIH')
                        .drawLine()
                        .cut()
                        .close() 
                     });
                  })
            }
        });
       
       return  {
            state: true,
            message: 'SUCCESS TEST PRINTER'
          }
        
    }catch(err){
      console.log(err)
        return {
          state: false,
          message: err.message
        }
      
    }
}


const printInvoice = (invoiceCode) =>{
  return new Promise(async(resolve, reject)=>{
    try{
        const outletInfo = await getOutletInfo();
        const invoiceInfo = await getInvoiceInfo(invoiceCode);
        const sellingCode = invoiceInfo.selling_order_code;
        const itemList = await getItemList(sellingCode);
        const promoInfo = await getPromoInfo();
        const invoiceDetail = await getInvoiceDetail(invoiceCode);

        const options = { encoding: "GB18030" /* default */ };
        const device = new escpos.USB();
        const printer = new escpos.Printer(device, options);

        device.open((err)=>{
          if(err){
            resolve({
              state: false,
              message: err.message
            });
          }else{
            printer
              .newLine()
              .align('ct')
              escpos.Image.load(path.join(__dirname+'../assets/tb_ori.png'), (image)=>{
                printer.image(image)
                  .then(()=>{
                    printer
                      .font('a')
                      .size(0.1,1)
                      .newLine()
                      .newLine()
                      .style('NORMAL')
                      .text(outletInfo.outlet_name)
                      .text(outletInfo.outlet_address)
                      .text(outletInfo.outlet_second_address)
                      .text(outletInfo.outlet_phone)
                      .text(outletInfo.outlet_city)
                      .newLine()
                      .text('INVOICE')
                      
                  })
              })
          }
        });

    }catch(err){

    }
  });
}

/*
    FONT SEMI GEDE
        .size(1, 0.1)
*/

module.exports = {
  testPrint
}
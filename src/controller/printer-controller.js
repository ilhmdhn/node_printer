const escpos = require('escpos');
const path = require('path');
escpos.USB = require('escpos-usb');
const { currency } = require('../tools/currency');

const {
  getOutletInfo,
  getInvoiceInfo,
  getPromoInfo,
  getItemList,
  getInvoiceDetail,
  getBill,
  getBillDetail
} = require('../model/invoice-model');

const testPrint = () => {
  try {
    const options = { encoding: "GB18030" /* default */ };
    const device = new escpos.USB();
    const printer = new escpos.Printer(device, options);
    device.open((err) => {
      if (err) {
        return {
          state: false,
          message: err.message
        }
      } else {
        printer.newLine()
          .align('ct')
        escpos.Image.load(path.join(__dirname, '../assets/tb_ori.png'), (image) => {
          printer.image(image).then(() => {
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
                  { text: "PAX: 1", align: "LEFT", width: 0.5 },
                  { text: "OP: Indah", align: "RIGHT", width: 0.5 }
                ],
                { size: [1, 1] } // Optional
              )
              .tableCustom(
                [
                  { text: "POS Title: DP", align: "LEFT", width: 0.5 },
                  { text: "POS: POS012", align: "RIGHT", width: 0.5 }
                ],
                { size: [1, 1] } // Optional
              )
              .tableCustom(
                [
                  { text: "Rcpt#: K2200061772", align: "LEFT", width: 0.5 },
                  { text: "14/02/2023 11:26", align: "RIGHT", width: 0.5 }
                ],
                { size: [1, 1] } // Optional
              )
              .style('B')
              .text('-----------------------------------------------')
              .style('NORMAL')
              .tableCustom(
                [
                  { text: " 1 DONAT SATE MUISJES", align: "LEFT", width: 0.75 },
                  { text: "16.000", align: "RIGHT", width: 0.25 }
                ],
                { size: [1, 1] } // Optional
              )
              .tableCustom(
                [
                  { text: " 1 KROKET AYAM JAMUR", align: "LEFT", width: 0.75 },
                  { text: "16.000", align: "RIGHT", width: 0.25 }
                ],
                { size: [1, 1] } // Optional
              )
              .tableCustom(
                [
                  { text: " 1 LUMPIA BASAH MIKA", align: "LEFT", width: 0.75 },
                  { text: "23.000", align: "RIGHT", width: 0.25 }
                ],
                { size: [1, 1] } // Optional
              )
              .tableCustom(
                [
                  { text: " 2 PASTEL SUN", align: "LEFT", width: 0.75 },
                  { text: "30.000", align: "RIGHT", width: 0.25 }
                ],
                { size: [1, 1] } // Optional
              )
              .style('B')
              .text('-----------------------------------------------')
              .style('NORMAL')
              .tableCustom(
                [
                  { text: "   SUBTOTAL", align: "LEFT", width: 0.75 },
                  { text: "85.000", align: "RIGHT", width: 0.25 }
                ],
                { size: [1, 1] } // Optional
              )
              .tableCustom(
                [
                  { text: "   Inc. PPN 11%", align: "LEFT", width: 0.75 },
                  { text: "8.423", align: "RIGHT", width: 0.25 }
                ],
                { size: [1, 1] } // Optional
              )
              .style('B')
              .text('-----------------------------------------------')
              .style('NORMAL')
              .tableCustom(
                [
                  { text: "   TOTAL", align: "LEFT", width: 0.75 },
                  { text: "85.000", align: "RIGHT", width: 0.25 }
                ],
                { size: [1, 1] } // Optional
              )
              .tableCustom(
                [
                  { text: "   SUBTOTAL", align: "LEFT", width: 0.75 },
                  { text: "85.000", align: "RIGHT", width: 0.25 }
                ],
                { size: [1, 1] } // Optional
              )
              .style('B')
              .text('==============================================')
              .style('NORMAL')
              .text('Closed Bill')
              .text('<--------------24/02/2023 13:34--------------->')
              .text('TERIMA KASIH')
              .style('B')
              .drawLine()
              .style('NORMAL')
              .cut()
              .close()
          });
        })
      }
    });

    return {
      state: true,
      message: 'SUCCESS TEST PRINTER'
    }

  } catch (err) {
    console.log(err)
    return {
      state: false,
      message: err.message
    }

  }
}


const printInvoice = (invoiceCode) => {
  return new Promise(async (resolve, reject) => {
    try {

      const outletInfo = await getOutletInfo();
      const invoiceDetail = await getInvoiceDetail(invoiceCode);
      const sellingCode = invoiceDetail.selling_order_code;
      const orderInfo = await getInvoiceInfo(sellingCode);
      const itemList = await getItemList(sellingCode);
      const billInfo = await getBill(sellingCode);
      const billDetail = await getBillDetail(billInfo.bill_code);


      const options = {
        encoding: "GB18030", /* default */
        width: 48
      };
      const device = new escpos.USB();
      const printer = new escpos.Printer(device, options);
      device.open((err) => {
        if (err) {
          resolve({
            state: false,
            message: err.message
          });
        } else {
          printer
            .newLine()
            .align('ct')
          escpos.Image.load(path.join(__dirname, '../assets/tb_ori.png'), (image) => {
            printer.image(image)
              .then(async () => {
                printer
                  .font('a')
                printer
                  .size(0.1, 1)
                  .newLine()
                  .style('NORMAL')
                  .text(outletInfo.outlet_name)
                  .text(outletInfo.outlet_address)
                  .text(outletInfo.outlet_second_address)
                  .text(outletInfo.outlet_phone)
                  .text(outletInfo.outlet_city)
                  .newLine()
                  .text('INVOICE')
                  .newLine()
                if (itemList != false) {
                  for (let i = 0; i < itemList.length; i++) {
                    printer
                      .align('LT')
                      .text(itemList[i].item_name)
                      .align('ct')
                      .tableCustom(
                        [
                          { text: `   ${itemList[i].item_qty} x ${currency(parseFloat(itemList[i].item_price))}`, align: "LEFT", width: 0.5 },
                          { text: currency(itemList[i].item_qty * itemList[i].item_price), align: "RIGHT", width: 0.5 }
                        ],
                        { size: [1, 1] } // Optional
                      )
                      if (itemList[i].item_discount != '0') {
                      let promoInfo = await getPromoInfo(itemList[i].selling_code, itemList[i].inventory);
                      printer
                        .tableCustom(
                          [
                            { text: itemList[i].item_discount, align: "LEFT", width: 0.5 },
                            { text: `(${promoInfo.promo_charge})`, align: "RIGHT", width: 0.5 }
                          ],
                          { size: [1, 1] } // Optional
                        )
                        .align('ct')
                    }
                  }
                }
                printer
                  .align('ct')
                  .style('B')
                  .drawLine()
                  .style('NORMAL')
                  .align('RT')
                  .tableCustom(
                    [
                      // { text: '', align: "LEFT", width: 0.5 },
                      { text: 'Subtotal', align: "RIGHT", width: 0.3 },
                      { text: `${currency(invoiceDetail.selling_charge)}`, align: "RIGHT", width: 0.3 }
                    ],
                    { size: [1, 1] } // Optional
                  )
                  .tableCustom(
                    [
                      // { text: '', align: "LEFT", width: 0.5 },
                      { text: 'Discount', align: "RIGHT", width: 0.3 },
                      { text: `(${currency(invoiceDetail.selling_discount)})`, align: "RIGHT", width: 0.3 }
                    ],
                    { size: [1, 1] } // Optional
                  )
                  .tableCustom(
                    [
                      // { text: '', align: "LEFT", width: 0.5 },
                      { text: 'Tax', align: "RIGHT", width: 0.3 },
                      { text: `(${currency(invoiceDetail.selling_tax)})`, align: "RIGHT", width: 0.3 }
                    ],
                    { size: [1, 1] } // Optional
                  )
                  .tableCustom(
                    [
                      { text: '-----------------', align: "RIGHT", width: 0.5 }
                    ],
                    { size: [1, 1] } // Optional
                  )
                  .tableCustom(
                    [
                      // { text: '', align: "LEFT", width: 0.5 },
                      { text: 'Total', align: "RIGHT", width: 0.3 },
                      { text: `${currency(billInfo.total)}`, align: "RIGHT", width: 0.3 }
                    ],
                    { size: [1, 1] } // Optional
                  )
                for (let i = 0; i < billDetail.length; i++) {
                  printer
                    .tableCustom(
                      [
                        { text: billDetail[i].payment_name, align: "RIGHT", width: 0.3 },
                        { text: `(${currency(billDetail[i].pay_value)})`, align: "RIGHT", width: 0.3 }
                      ],
                      { size: [1, 1] } // Optional
                    )
                }
                printer
                  .tableCustom(
                    [
                      { text: '-----------------', align: "RIGHT", width: 0.5 }
                    ],
                    { size: [1, 1] } // Optional
                  )
                printer
                  .size(1, 0.1)
                  .text(`Kembali    ${currency(billInfo.retur)}`)
                  .size(0, 0)
                  .size(0.1, 1)
                  .style('B')
                  .drawLine()
                  .style('NORMAL')
                  .newLine()
                  .align('ct')
                  .text('- Barang yang sudah dibeli tidak bisa dibatalkan')
                  .newLine()
                  .style('B')
                  .text('THANK YOU')
                  .style('NORMAL')
                  .newLine()
                  .newLine()
                  .align('rt')
                  .text(`${orderInfo.invoice_date} ${orderInfo.user}`)
                  .cut()
                  .flush()
                  .close()
              })
          })
        }
      });
      resolve({
        state: true,
        message: 'INVOICE PRINT SUCCESS'
      });
    } catch (err) {
      resolve({
        state: false,
        message: err
      })
    }
  });
}

module.exports = {
  testPrint,
  printInvoice
}
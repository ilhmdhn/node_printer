const cron = require("node-cron");
const {getWaitingPrint} = require('../model/invoice-model');
const {manualPrint} = require('../controller/printer-controller');

const timer = "*/1 * * * * *";
let isRunning = false;
const startTimer = async () =>{
    cron.schedule(timer, async()=>{
        if(!isRunning){
            console.log('detik', isRunning);
            let orderCode = await getWaitingPrint();
            if(orderCode != false){
                await manualPrint(orderCode);
            }
            isRunning = false;
        }
    });
}

module.exports = startTimer;
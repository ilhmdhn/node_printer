var cron = require("node-cron");

const timer = "*/1 * * * * *";

const startTimer = async () =>{
    cron.schedule(timer, async()=>{
        
    });
}

module.exports = startTimer;
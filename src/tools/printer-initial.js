const os = require('os');
require('dotenv').config();
const { Interface } = require('readline');

const identity = () =>{
    return new Promise((resolve, reject)=>{
        try{
            const networkInterface = os.networkInterfaces();
            let ip = [];
            let ip_fix;
            for (var i in networkInterface) {
                for (var j in networkInterface[i]) {
                    var address = networkInterface[i][j];
                    if (address.family === 'IPv4' && !address.internal) {
                        ip.push(address.address);
                    }
                }
            }
            for (let i in ip) {
                if (ip[i] !== undefined) {
                    ip_fix = ip[i];
                }
            }
            const identity = {
                ipAddress: ip_fix,
                name: process.env.PRINTER_NAME,
                port: process.env.PRINTER_PORT
            }
            resolve(identity);
        }catch(err){
            reject(err.message);
        }
    });
}

module.exports = identity;
require('dotenv').config();

const identity = () =>{
    return new Promise((resolve, reject)=>{
        try{
            const identity = {
                ipAddress: process.env.IP_ADDRESS,
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
var ccxt = require("ccxt");
let password = process.env.kucoinApiPassword
if (password != undefined){
if (password.length < 2){
  password = 'Melani3B4b%'
}
}else{
    password = 'Melani3B4b%'

}

console.log(password)
let kucoin  = new ccxt.kucoin ({ 'password': password,'enableRateLimit': true,apiKey: process.env.binApiKey || "5caf923438300c0986228ecd", secret: process.env.binApiSecret || "035f5fd9-6e91-4fc4-9e10-25221d9678d6" })


const api = require('kucoin-node-api')
 
const config = {
  apiKey: process.env.binApiKey || "5caf923438300c0986228ecd",
  secretKey: process.env.binApiSecret || "035f5fd9-6e91-4fc4-9e10-25221d9678d6",
  passphrase: password,
  environment: 'live'
}
 
api.init(config)

api.initSocket({topic: "balances"}, (msg) => {
  let data = JSON.parse(msg)
  console.log(data)
})

async function logg(){
console.log(await kucoin.fetchBalance())
}
logg()
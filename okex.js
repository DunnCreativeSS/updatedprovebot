module.exports = {

};
var OKEX = require('okex-rest');
var privateClient = new OKEX(process.env.okexv1key || "0532b50c-ec19-4852-9c6b-e6643d3650c8", process.env.okexv1secret || "02E867301D20E59CF9A38C4DB160968F");
 let apikey
if (process.env.binApiKey == undefined){
  apikey = "b2516579-936d-4cd3-9981-362136fc4748"
}   else {
  apikey = process.env.binApiKey
}
let apisecret
if (process.env.binApiSecret == undefined){
  apisecret = "A4D467570BAE9B39BF30CAECE280E568"
}   else {
  apisecret = process.env.binApiSecret
}
const { PublicClient } = require('@okfe/okex-node');
const { V3WebsocketClient } = require('@okfe/okex-node');
const { AuthenticatedClient } = require('@okfe/okex-node');
const pClient = new PublicClient();
const authClient = new AuthenticatedClient(apikey,apisecret, process.env.okexPass || 'w0rdp4ss');
const wss = new V3WebsocketClient();

let modular = require('./modular.js')
var ccxt = require("ccxt");

let okex  = new ccxt.okex ({ 'enableRateLimit': true,apiKey: process.env.okexv1key || "0532b50c-ec19-4852-9c6b-e6643d3650c8", secret: process.env.okexv1secret || "02E867301D20E59CF9A38C4DB160968F" })



setInterval(async function(){
  let tickers = await okex.fetchTickers()
  let markets =await okex.fetchMarkets()
  for (var t in tickers) {
    let gospot = false;
    for (var market in markets){
      if (markets[market].symbol == t && markets[market].type == 'spot'){
        gospot = true;
      }
    }
    if (gospot){
    if (modular.asks[tickers[t].symbol] == undefined) {
            modular.asks[tickers[t].symbol] = {}
            modular.bids[tickers[t].symbol] = {}
        }
        let pair;
        if (tickers[t].symbol.substring(tickers[t].symbol.length - 4, tickers[t].symbol.length).startsWith('USD')) {
            pair = tickers[t].symbol.substring(0, tickers[t].symbol.length - 4) + '/' + tickers[t].symbol.substring(tickers[t].symbol.length - 4, tickers[t].symbol.length);
        } else {
            pair = tickers[t].symbol.substring(0, tickers[t].symbol.length - 3) + '/' + tickers[t].symbol.substring(tickers[t].symbol.length - 3, tickers[t].symbol.length);

        }
        if (!modular.pairs.includes(pair)) {
            modular.pairs.push(pair);
        }
        modular.asks[tickers[t].symbol]['default'] = tickers[t].ask
        modular.bids[tickers[t].symbol]['default'] = tickers[t].bid
        if (tickers[t].symbol.startsWith('ETH/USD')) {
        ////console.log(tickers[t].symbol)
            btcs['ETH'] = tickers[t].bid;
        } else if (tickers[t].symbol == 'BNBBTC') {
            btcs['BNB'] = tickers[t].bid;
        }
        let symbol = tickers[t].symbol;
        let asset;
        if (symbol.substring(symbol.length - 3, symbol.length) == 'BTC') {

            asset = symbol.substring(0, symbol.length - 3)


            if (asset != 'ETH' && asset != 'BTC' && asset != 'USD' && asset != 'BNB') {
                btcs[asset] = parseFloat(tickers[t].bid)
            }

        }
        if (symbol.substring(symbol.length - 3, symbol.length) == 'ETH') {

            asset = symbol.substring(0, symbol.length - 3)
          
          
                      if (true) {
          eths[asset] = parseFloat(tickers[t].bestBid)
                      }
          
                  }

        if (tickers[t].symbol.startsWith('BTC/USD')) {
////console.log(asset)
            for (b in btcs) {
                btcs2[b] = btcs[b]
            }
            btcs['BTC'] = parseFloat(tickers[t].bid);
        }
        let spread = (100 * (1 - parseFloat(tickers[t].bid) / parseFloat(tickers[t].ask)))
        spreads[tickers[t].symbol] = spread;
        if (tickers[t].quoteVolume == undefined){
        if (tickers[t].info.volume_24h == undefined){
          
          modular.tickVols[tickers[t].symbol] = parseFloat((tickers[t].info.vol)) * parseFloat(tickers[t].bid)
        }
        else{
          modular.tickVols[tickers[t].symbol] = parseFloat((tickers[t].info.volume_24h)) * parseFloat(tickers[t].bid)
        }
        }else {
        ////console.log(tickers[t].quoteVolume)
        modular.tickVols[tickers[t].symbol] = (parseFloat(tickers[t].quoteVolume)) * parseFloat(tickers[t].bid)
        }
        if (!modular.ticks.includes(tickers[t].symbol) && spread) {
            //spreads[tickers[t].symbol] = spread;
            //tickVols[tickers[t].symbol] = (parseFloat(tickers[t].volumeQuote))
            if (tickers[t].symbol.substring(tickers[t].symbol.length - 4, tickers[t].symbol.length).includes('USD')) {
                if (!modular.bases.includes(tickers[t].symbol.substring(tickers[t].symbol.length - 4, tickers[t].symbol.length))) {
                    modular.bases.push(tickers[t].symbol.substring(tickers[t].symbol.length - 4, tickers[t].symbol.length))
                }
            } else {
                if (!modular.bases.includes(tickers[t].symbol.substring(tickers[t].symbol.length - 3, tickers[t].symbol.length))) {
                    modular.bases.push(tickers[t].symbol.substring(tickers[t].symbol.length - 3, tickers[t].symbol.length))
                }
            }
            modular.ticks.push(tickers[t].symbol)
            for (var t in tickers) {
                for (b in modular.bases) {
                    if (modular.vols[modular.bases[b]] == undefined) {
                        modular.vols[modular.bases[b]] = 0;
                        modular.cs[modular.bases[b]] = 0;
                    }
                    let vvv;
                    if (tickers[t].quoteVolume == undefined){
                      if (tickers[t].info.volume_24h == undefined){
                        vvv  = parseFloat(tickers[t].info.vol)
                      }
                      else {
                      vvv = parseFloat(tickers[t].info.volume_24h)*tickers[t].bid
                    }
                    }
                    else {
                      vvv = parseFloat(tickers[t].quoteVolume)*tickers[t].bid
                    }
                    if (tickers[t].symbol.substring(tickers[t].symbol.length - 4, tickers[t].symbol.length) == modular.bases[b]) {
                      
                        modular.vols[modular.bases[b]] += vvv * tickers[t].bid;
                        modular.cs[modular.bases[b]]++;
                    } else if (tickers[t].symbol.substring(tickers[t].symbol.length - 3, tickers[t].symbol.length) == modular.bases[b]) {
                        modular.vols[modular.bases[b]] += vvv * tickers[t].bid;
                        modular.cs[modular.bases[b]]++;
                    }
                }

            }
        }

        }
    }
        
    
}, 5000)
let thebooks = {}
let candles = {}
const express = require('express');
const app = express();
app.get('/trades2', (req, res) => {
    res.json(trades2)
});
app.get('/filters', (req, res) => {
    res.json(filters)
});
app.get('/btcVol', (req, res) => {
    res.json({'btcVol':btcVol})
});
app.get('/bals', (req, res) => {
    res.json(bals)
});
app.get('/btcs', (req, res) => {
    res.json(btcs)
});
app.get('/btcs2', (req, res) => {
    res.json(btcs2)
});
let eths = {}
app.get('/eths', (req, res) => {
    res.json(eths)
});
app.get('/thetotals', (req, res) => {
    res.json(thetotals)
});
app.get('/starts', (req, res) => {
    res.json(starts)
});
let starts = []
app.get('/buyOs', (req, res) => {
    res.json(buyOs)
});

async function getthebals(){
  btcs138 = {}
  let bals = await okex.fetchBalance();
  myBals = bals
     for (var bal in myBals){
       myBals[bal].asset = bal
       let amt = parseFloat(myBals[bal].total)
         if (amt != 0 && !isNaN(amt) && Object.keys(modular.asks).length > 5){
       modular.bases.unshift('BTC')
       for (var b in modular.bases){
       //  //console.log(bal + 'BTC')
if ((modular.asks[myBals[bal].asset + '/' + modular.bases[b]]) != undefined){
  if (myBals[bal].asset == 'BTC'){
    btcs138[myBals[bal].asset] = amt
  }
 if (modular.bases[b] == 'BTC'){
       btcs138[myBals[bal].asset]=amt * parseFloat(modular.asks[myBals[bal].asset + '/' + modular.bases[b]].default)
        }
        else {
          if (btcs2[modular.bases[b]] != undefined&& btcs138[myBals[bal].asset] == undefined){
            
       btcs138[myBals[bal].asset]=amt * parseFloat(modular.asks[myBals[bal].asset + '/' + modular.bases[b]].default) * parseFloat(btcs2[modular.bases[b]])
}
        }
        if (myBals[bal].asset == 'BTC'){
        console.log('asset ' + myBals[bal].asset)
        console.log('amt ' + amt)
        console.log(btcs138[myBals[bal].asset])
        }
        }       }
       
     }
       
     }
     let total = 0;
     for (var b in btcs138){
       total+=(btcs138[b])
       }
       console.log(btcs138)
       console.log('btcs128 keys ' + Object.keys(btcs138).length)
       console.log('total ' + total)
       let total2 = total
       btcstart = total2
             altstart = total2 / parseFloat(btcs2['BNB'])
             usdstart = total2 * parseFloat(btcs['BTC'])
            thetotals=([{usdstart: usdstart, btcstart: btcstart, altstart: altstart}])
  
}
setInterval(function(){
  getthebals()
}, 10000)
async function dostarts(){
  let bals = await okex.fetchBalance();
  myBals = bals
     for (var bal in myBals){
       myBals[bal].asset = bal
       let amt = parseFloat(myBals[bal].total)
         if (amt != 0 && !isNaN(amt) && Object.keys(modular.asks).length > 5){
              modular.bases.unshift('BTC')

       for (var b in modular.bases){
       //  //console.log(bal + 'BTC')
if ((modular.asks[myBals[bal].asset + '/' + modular.bases[b]]) != undefined){
  if (myBals[bal].asset == 'BTC'){
    btcs138[myBals[bal].asset] = amt
  }
 if (modular.bases[b] == 'BTC'){
       btcs138[myBals[bal].asset]=amt * parseFloat(modular.asks[myBals[bal].asset + '/' + modular.bases[b]].default)
        }
        else {
          if (btcs2[modular.bases[b]] != undefined&& btcs138[myBals[bal].asset] == undefined){
            
       btcs138[myBals[bal].asset]=amt * parseFloat(modular.asks[myBals[bal].asset + '/' + modular.bases[b]].default) * parseFloat(btcs2[modular.bases[b]])
}
        }
        if (myBals[bal].asset == 'BTC'){
        console.log('asset ' + myBals[bal].asset)
        console.log('amt ' + amt)
        console.log(btcs138[myBals[bal].asset])
        }
        }       }
       
     }
       
     }
     let total = 0;
     for (var b in btcs138){
       total+=(btcs138[b])
       }
       console.log(total)
       let total2 = total
       btcstart = total2
             altstart = total2 / parseFloat(btcs2['BNB'])
             usdstart = total2 * parseFloat(btcs['BTC'])

            starts=([{usdstart: usdstart, btcstart: btcstart, altstart: altstart}])
            console.log(starts)
     /*
        console.log(total2)
            totalold = total2
            btcstart = total2
             altstart = total2 / parseFloat(btcs2['BNB'])
             usdstart = total2 * parseFloat(btcs['BTC'])

            starts=([{usdstart: usdstart, btcstart: btcstart, altstart: altstart}])
            console.log(starts)
        */
        }
setTimeout(function(){
dostarts()
}, 30000)
let thetotals;
let buyOs = {}
let btcs2 = {}
let btcs = {}
let bals = {}
app.get('/spreads', (req, res) => {
    res.json(spreads)
});
app.get('/candles', (req, res) => {
    res.json(candles)
});
app.get('/thebooks', (req, res) => {
    res.json(thebooks)
});
app.listen(process.env.binPORT || 8082, function() {});

let candies = []



let spreads = {}


async function test(){
  /*
  let os = await authClient.spot().getOrdersPending()
  for (var o in os){
    //console.log(os[o])
  privateClient.cancelOrder(//console.log,  os[o].instrument_id.replace('-', '_').toLowerCase(), os[o].order_id);
  }

*/
}
test()

module.exports.exchangeOpenOrders = async function exchangeOpenOrders(){
 
  let os = await authClient.spot().getOrdersPending()
  for (var o in os){
    os[o].symbol = os[o].instrument_id.replace('-','/')
  }
 // //console.log(os)
  return os

}
module.exports.exchangeOpenOrdersBySymbol = async function exchangeOpenOrdersBySymbol(symbol){
  return await okex.fetchOpenOrders(symbol, since, limit)

}
let cancelled = []
module.exports.exchangeCancelOrder = async function exchangeCancelOrder(order){
 ////console.log('cancel')
 if (!cancelled.includes(order.order_id)){
   //console.log(order.order_id)
cancelled.push(order.order_id)
 await privateClient.cancelOrder(console.log, order.instrument_id.replace('-', '_').toLowerCase(), order.order_id);
}
}
module.exports.doob =async function doob(tickVols, t){
  let t2 = tickVols[t]
  ////console.log('thebooks ' + t2)
  let ob =  await okex.fetchOrderBook(t2, 10);
thebooks[t2] = {asks: ob.asks, bids: ob.bids}
setTimeout(function(){
  if (t == tickVols.length -1){
    t = -1;
  }
  doob(tickVols, t+1)
},okex.rateLimit)
}
let first = true;

let ex = (process.env.ex) || 'binance'
async function fetchmarkets(){
  
////console.log()
}
fetchmarkets()
module.exports.exchangeCandlesAndBooks = async function exchangeCandlesAndBooks(tickVols){
 let since = okex.milliseconds () - 86400000
    let limit = 100;
        if(okex.has['fetchOHLCV'] == 'emulated'){
          for (var t in tickVols){
          
      let since = okex.milliseconds () - 86400000 / 2
    let limit = 24;
          candles[t]=tickVols[t]
          let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms));

        }
        }else {
          if (ex == 'okex'){
            //tickVols = tickVols.replace('/','_')
            try{
               ////console.log('tickvols' + tickVols)
          let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms));

                  await sleep (okex.rateLimit) // milliseconds

        let candles2 =  (await okex.fetchOHLCV (tickVols, '1h', since)) // one minute
        let candle = candles2[candles2.length-1]
        candles[tickVols] = candle[5]
        ////console.log('candles tickVol ' + tickVols)
            } catch (err){
              ////console.log(err)
            }
          }else{
          for (var t in tickVols){
          let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms));

                  await sleep (okex.rateLimit) // milliseconds

        let candles2 =  (await okex.fetchOHLCV (t, '1h', since, limit)) // one minute
        let candle = candles2[candles2.length-1]
        candles[t] = candle[5]
}
}

}
}

async function setBal(){

  let balances =  await okex.fetchBalance();
  let bals138 = {}
    for (var b in balances) {

            bals138[b] = parseFloat(balances[b].total)
        
    }
    return bals138;
}
let dodo = true;
setBal()
let btcs138 = {}
module.exports.alt = "ETH";
setInterval(async function(){
  let balances = await okex.fetchBalance();
  bals = {}
  for (var b in balances){
    if (balances[b] != undefined){
      if (parseFloat(balances[b].free) > 0 || parseFloat(balances[b].total) > 0) {
          modular.bals3[b] = parseFloat(balances[b].free)
          modular.bals4[b] = parseFloat(balances[b].total) - parseFloat(balances[b].free)
          modular.balscombined[b] = parseFloat(balances[b].total)
          bals[b] = parseFloat(balances[b].total)
      }
    }
  }
  }, 10000);
module.exports.exchangeUpdateBalances = async function exchangeUpdateBalances(){
  setInterval(async function(){
  let balances = await okex.fetchBalance();
  bals = {}
  for (var b in balances){
    if (balances[b] != undefined){
      if (parseFloat(balances[b].free) > 0 || parseFloat(balances[b].total) > 0) {
          modular.bals3[b] = parseFloat(balances[b].free)
          modular.bals4[b] = parseFloat(balances[b].total) - parseFloat(balances[b].free)
          modular.balscombined[b] = parseFloat(balances[b].total)
          bals[b] = parseFloat(balances[b].total)
      }
    }
  }
  }, 10000);
}
let tradeids = []
let trades2 = []
let btcVol = 0;
module.exports.exchangeDoTrades = async function exchangeDoTrades(symbol){
  let since = okex.milliseconds () - 86400000
    let limit = 100;
    if (ex == 'okex'){
    symbol = symbol.replace('/','-')
    }
    let orders = await authClient.spot().getOrders({instrument_id: symbol, status: 'filled'})
    for (var o in orders){
 let trades = await authClient.spot().getFills({instrument_id: symbol, order_id: orders[o].order_id})
            modular.ts[symbol] = (trades)

            for (var t in trades) {
              trades[t].timestamp = new Date(trades[t].timestamp).getTime()
              
                if (!tradeids.includes(trades[t].order_id + trades[t].timestamp) && parseFloat(trades[t].fee) != 0 && parseFloat(trades[t].timestamp) > starttime2) {

                    tradeids.push(trades[t].order_id + trades[t].timestamp);
                    trades2.push({
                        'commission': parseFloat(trades[t].price) * parseFloat(trades[t].size),
                        'quoteQty': parseFloat(trades[t].price) * parseFloat(trades[t].size),
                        'symbol': trades[t].instrument_id,
                        'qty': trades[t].size,
                        'price': trades[t].price,
                        'isBuyer': trades[t].side,
                        'time': trades[t].timestamp
                    })
                    if (trades[t].instrument_id != 'ETHBTC' && trades[t].instrument_id != 'USDBTC' && trades[t].instrument_id != 'BTCUSD') {
                        if (trades[t].instrument_id.substring(trades[t].instrument_id.length - 4, trades[t].instrument_id.length).startsWith('USD') || trades[t].instrument_id.substring(trades[t].instrument_id.length - 3, trades[t].instrument_id.length).startsWith('USD')) {
                            btcVol+= parseFloat(parseFloat(trades[t].price) * parseFloat(trades[t].size)) / btcs['BTC']
                        } else if (trades[t].instrument_id.substring(trades[t].instrument_id.length - 3, trades[t].instrument_id.length) == 'ETH') {
                            btcVol+= parseFloat(parseFloat(trades[t].price) * parseFloat(trades[t].size)) / btcs['ETH']
                            ////console.log((parseFloat(parseFloat(trades[t].price) * parseFloat(trades[t].size))))
                        } else if (trades[t].instrument_id.substring(trades[t].instrument_id.length - 3, trades[t].instrument_id.length) == 'BTC') {
                            ////console.log((parseFloat(parseFloat(trades[t].price) * parseFloat(trades[t].size))))
                            btcVol+= ((parseFloat(parseFloat(trades[t].price) * parseFloat(trades[t].size))))
                        } else if (trades[t].instrument_id.substring(trades[t].instrument_id.length - 3, trades[t].instrument_id.length) == 'BNB') {
                            btcVol+= (((parseFloat(parseFloat(trades[t].price) * parseFloat(trades[t].size)) * btcs['BNB'])))
                        }
                    }
                        ////console.log('btcVol: ' + btcVol)
                    if (trades[t].timestamp > actualstarttime) {
                   //     //////console.log(trades[t])
                        if (trades[t].isBuyer == 'buy') {
                            let symbol = trades[t].instrument_id
                            if (!Number.isNaN(parseFloat(trades[t].size))){
                            if (buyOs[symbol] == undefined) {
                                buyOs[symbol] = []
                            }
                            modular.dontgo2[trades[t].instrument_id] = true
                            modular.settimeoutdontgo(trades[t].instrument_id)
                            if (true) {

                                if (modular.avgBids[symbol] > 0.00000000000000000001) {
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (minProfit),
                                        qty: parseFloat(trades[t].size)
                                    });
                                } else {
                                    modular.avgBids[symbol] = parseFloat(bp);
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (minProfit),
                                        qty: parseFloat(trades[t].size)
                                    })
                                }
                            } else {
                                if (modular.avgBids[symbol] > 0.00000000000000000001) {
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (minProfit),
                                        qty: parseFloat(trades[t].size)
                                    })
                                } else {
                                    modular.avgBids[symbol] = parseFloat(bp);
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (minProfit),
                                        qty: parseFloat(trades[t].size)
                                    })
                                }
                            }
                            //dontbuy[trades[t].instrument_id] = true
                            //////console.log(symbol)
                            //////console.log(buyOs[symbol])
                        }
                        } else {
                            for (var buyo in buyOs[trades[t].instrument_id]) {
                                if (buyOs[trades[t].instrument_id][buyo].price < parseFloat(trades[t].price)) {
                                    //////console.log(trades[t].instrument_id + ' buyos slice: ')
                                    //////console.log( buyOs[trades[t].instrument_id][buyo])
                                    buyOs[trades[t].instrument_id].splice(buyo, 1);

                                }
                            }
                        }
                    }
                   
                }
            }
    }
}
let actualstarttime = new Date().getTime()
let starttime2 = new Date().getTime() - 24 * 60 * 60 * 1000;
let filters = {}
module.exports.exchangeInfo = async function exchangeInfo(){
  ////console.log('exinfo')
  let exchange = (await okex.fetchMarkets())
    for (var ex in exchange) {
        let symbol = exchange[ex].symbol
        filters[symbol] = {
            'minPrice': parseFloat(0),
            'minQty': parseFloat(1),
            'tickSize': modular.countDecimalPlaces(parseFloat(exchange[ex].info.quoteIncrement)),
            'stepSize': (parseFloat(exchange[ex].info.quotePrecision)),
            'minNotional': parseFloat(0.000001)
        }
    }
}

module.exports.exchangeOrder = async function exchangeOrder(symbol, side, qty, price, type){
  ////console.log(symbol)
  ////console.log(side)
  ////console.log(qty)
  ////console.log(price)
  ////console.log(type)
  let o = await okex.createOrder (symbol, type.toLowerCase(), side.toLowerCase(), qty, price)
  if (side.toLowerCase() == 'sell'){
  console.log(o)
}
  return(o)
}
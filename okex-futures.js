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




setInterval(async function(){
 doTicks();
    
}, 30000)
async function doTicks(){
   let tickers = await pClient.futures().getInstruments()
  for (var t in tickers) {
    let ticker = await pClient.futures().getTicker(tickers[t].instrument_id)
    if (true){
    if (modular.asks[tickers[t].instrument_id] == undefined) {
            modular.asks[tickers[t].instrument_id] = {}
            modular.bids[tickers[t].instrument_id] = {}
            modular.asks[tickers[t].underlying_index] = {}
            modular.bids[tickers[t].underlying_index] = {}
        }
        let pair;
        
            pair = tickers[t].instrument_id

        if (!modular.pairs.includes(pair)) {
            modular.pairs.push(pair);
        }
        if (tickers[t].instrument_id.startsWith('ETH-USD')) {
        ////console.log(tickers[t].instrument_id)
            btcs['ETH'] = ticker.last
        }
        let symbol = tickers[t].instrument_id;
        let asset;
        
            asset = tickers[t].underlying_index


                btcs[asset] = parseFloat(ticker.last)

       

        if (tickers[t].instrument_id.startsWith('BTC-USD')) {
////console.log(asset)
            for (b in btcs) {
                btcs2[b] = btcs[b]
            }
            btcs['BTC'] = parseFloat(tickers[t].last);
        }
        let book = await  pClient.futures().getBook(tickers[t].instrument_id, {size:10})
        thebooks[tickers[t].instrument_id] = {asks: book.asks, bids: book.bids}

        let hb = 0;
        let la = 50000000000000000000000;
        for (var bid in book.bids) {
                if (parseFloat(book.bids[bid][0]) > hb) {
                    hb = parseFloat(book.bids[bid][0]);
                }
            }
            for (var ask in book.asks) {
                if (parseFloat(book.asks[ask][0]) < la) {
                    la = parseFloat(book.asks[ask][0])
                }
            }
            
        modular.asks[tickers[t].instrument_id]['default'] = la
        modular.bids[tickers[t].instrument_id]['default'] = hb
        modular.asks[tickers[t].underlying_index]['default'] = la
        modular.bids[tickers[t].underlying_index]['default'] = hb
        let spread = (100 * (1 - parseFloat(hb) / parseFloat(la)))
        console.log('spread: ' + spread)
        spreads[tickers[t].instrument_id] = spread;
        
        ////console.log(tickers[t].quoteVolume)
        modular.tickVols[tickers[t].instrument_id] = (parseFloat(ticker.volume_24h))
        
        if (!modular.ticks.includes(tickers[t].instrument_id) && spread) {
            //spreads[tickers[t].instrument_id] = spread;
            //tickVols[tickers[t].instrument_id] = (parseFloat(tickers[t].volumeQuote))
             if (!modular.bases.includes(tickers[t].quote_currency)) {
                    modular.bases.push(tickers[t].quote_currency)
                }
            modular.ticks.push(tickers[t].instrument_id)
                for (b in modular.bases) {
                    if (modular.vols[modular.bases[b]] == undefined) {
                        modular.vols[modular.bases[b]] = 0;
                        modular.cs[modular.bases[b]] = 0;
                    }
                    let vvv;
                        vvv  = (parseFloat(ticker.volume_24h))
                      
                    modular.vols[modular.bases[b]] += vvv
                        modular.cs[modular.bases[b]]++;
                    
                }

        }

        }
    }
        
}
doTicks()
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

let first2 = true;
async function getthebals(){
  btcs138 = {}
  let balances = await authClient.futures().getAccounts();
     let total2 = 0
     bals = {}
     for (var b in balances.info){
       bals[b] = parseFloat(balances.info[b].total_avail_balance)
       total2 += ((parseFloat(balances.info[b].total_avail_balance) * parseFloat(modular.bids[b.toUpperCase()]['default']) / parseFloat(modular.bids['BTC']['default'])))
     }
     
       btcstart = total2
             altstart = btcstart * parseFloat(btcs2['ETH'])
             usdstart = btcstart * parseFloat(btcs2['BTC'])

if (first2 == true && btcstart != 0){
  starts =([{usdstart: usdstart, btcstart: btcstart, altstart: altstart}])
  first2 = false
}
            thetotals=([{usdstart: usdstart, btcstart: btcstart, altstart: altstart}])
  console.log(thetotals)
}
setInterval(function(){
  getthebals()
}, 25000)
setTimeout(function(){
  getthebals()
}, 12000)
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

  let os = await authClient.futures().getOrders('ETC-USD-190628', {status:"0"})
  console.log(os)
  os = os.order_info
  for (var o in os){
    os[o].symbol = os[o].instrument_id
    if (os[o].type =='1'){
      os[o].side = 'BUY'
    }else {
      
      os[o].side = 'SELL'
    }
  }
 console.log(os)
}
test()

module.exports.exchangeOpenOrders = async function exchangeOpenOrders(symbol){
 
  let os = await authClient.futures().getOrders(symbol, {status:"0"})
  os = os.order_info
  for (var o in os){
    os[o].symbol = os[o].instrument_id
    if (os[o].type =='1'){
      os[o].side = 'BUY'
    }else {
      
      os[o].side = 'SELL'
    }
  }
  return os

}
let cancelled = []
module.exports.exchangeCancelOrder = async function exchangeCancelOrder(order){
 ////console.log('cancel')
 if (!cancelled.includes(order.order_id)){
   //console.log(order.order_id)
cancelled.push(order.order_id)
 console.log(await authClient.futures().cancelOrder(order.instrument_id, order.order_id));
}
}
module.exports.doob =async function doob(tickVols, t){
  
}
let first = true;

let ex = (process.env.ex) || 'binance'
async function fetchmarkets(){
  
////console.log()
}
fetchmarkets()
module.exports.exchangeCandlesAndBooks = async function exchangeCandlesAndBooks(tickVols){

        let candles2 =  (await pClient.futures().getCandles(tickVols)) // one minute
        let candle = candles2[candles2.length-1]
        candles[tickVols] = parseFloat(candle[6])
}


let dodo = true;
let btcs138 = {}
module.exports.alt = "ETH";
setInterval(async function(){
  /*
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
  }*/
  }, 10000);
module.exports.exchangeUpdateBalances = async function exchangeUpdateBalances(){
  setInterval(async function(){
    /*
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
  }*/
  }, 10000);
}
let tradeids = []
let trades2 = []
let btcVol = 0;
module.exports.exchangeDoTrades = async function exchangeDoTrades(symbol){
 
    let orders = await authClient.futures().getOrders({instrument_id: symbol, status: 'filled'})
    for (var o in orders){
 let trades = await authClient.futures().getFills({instrument_id: symbol, order_id: orders[o].order_id})
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
  let tickers = await pClient.futures().getInstruments()
  for (var t in tickers) {
        let symbol = tickers[t].instrument_id

        filters[symbol] = {
            'minPrice': parseFloat(0),
            'minQty': parseFloat(1),
            'tickSize': modular.countDecimalPlaces(parseFloat(tickers[t].tick_size)),
            'stepSize': (parseFloat(tickers[t].trade_increment)),
            'minNotional': parseFloat(0.000001)
        }
    }
}

module.exports.exchangeOrder = async function exchangeOrder(symbol, side, qty, price, type){
  console.log(symbol)
  console.log(side)
  console.log(qty)
  console.log(price)
  console.log(type)
  if (qty == 0){
    qty = 1;
  }
  let which
  let which2
  if (side.toUpperCase() == 'BUY'){
    which="1"
  }
  else{
    which="2"
  }
  
 
  let o = await authClient.futures().postOrder({"price":price.toString(),"type":which, "instrument_id":symbol, "size":qty.toString(), "leverage":"10"});
  
  return(o)
}

setInterval(function(){

doClose()
}, 60 * 1000 * 1.5)

async function doClose(){
    for (var p in modular.pairs){


      if (bals[modular.pairs[p].substring(0, 3).toLowerCase()] > 0){
      console.log(modular.pairs[p])
    qty = parseFloat((bals[modular.pairs[p].substring(0, 3).toLowerCase()] * 0.02)).toFixed(modular.filters[modular.pairs[p]].stepSize - 1)
         
         console.log(qty)  
         if (qty == 0){
          qty = 1;
         }                        
         console.log({"price": btcs[modular.pairs[p].substring(0, 3)].toString(),"type":"3", "instrument_id":modular.pairs[p], "size":(qty).toString(), "leverage":"10"})
      let o2 = await authClient.futures().postOrder({"price":modular.asks[modular.pairs[p]]['default'],"type":"3", "instrument_id":modular.pairs[p], "size":(qty).toString(), "leverage":"10"});
    let o3 = await authClient.futures().postOrder({"price":modular.bids[modular.pairs[p]]['default'],"type":"4", "instrument_id":modular.pairs[p], "size":(qty).toString(), "leverage":"10"});
    console.log(o2)
    console.log(o3)
    }
  }
}

setTimeout(function(){
  doClose()
}, 25000)
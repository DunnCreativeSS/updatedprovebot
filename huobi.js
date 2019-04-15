module.exports = {

};

let modular = require('./modular.js')
var ccxt = require("ccxt");
let kucoin  = new ccxt.kucoin ({ 'enableRateLimit': true, apiKey: process.env.binApiKey || "28a96db4-d14278c7-df31be77-f864d", secret: process.env.binApiSecret || "580df379-c896d49f-4e5efad1-e0dc0" })



setInterval(async function(){
  let tickers = await kucoin.fetchTickers()
  for (var t in tickers) {
    
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
        
        if (tickers[t].symbol == 'ETH/USD') {
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

        if (tickers[t].symbol == 'BTC/USD') {

            for (b in btcs) {
                btcs2[b] = btcs[b]
            }
            btcs['BTC'] = parseFloat(tickers[t].bid);
        }
        let spread = (100 * (1 - parseFloat(tickers[t].bid) / parseFloat(tickers[t].ask)))
        spreads[tickers[t].symbol] = spread;
        if (tickers[t].quoteVolume == undefined){
          
          modular.tickVols[tickers[t].symbol] = parseFloat((tickers[t].info.volume_24h))
        }else {
        modular.tickVols[tickers[t].symbol] = (parseFloat(tickers[t].quoteVolume))
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
                      vvv = parseFloat(tickers[t].info.volume_24h)
                    }
                    else {
                      vvv = parseFloat(tickers[t].quoteVolume)
                    }
                    if (tickers[t].symbol.substring(tickers[t].symbol.length - 4, tickers[t].symbol.length) == modular.bases[b]) {
                      
                        modular.vols[modular.bases[b]] += vvv;
                        modular.cs[modular.bases[b]]++;
                    } else if (tickers[t].symbol.substring(tickers[t].symbol.length - 3, tickers[t].symbol.length) == modular.bases[b]) {
                        modular.vols[modular.bases[b]] += vvv;
                        modular.cs[modular.bases[b]]++;
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
  let bals = await kucoin.fetchBalance();
  myBals = bals
     for (var bal in myBals){
       
       if (parseFloat(myBals[bal].total) != 0 && Object.keys(modular.bids).length > 5){
       let amt = parseFloat(myBals[bal].total)
       try {
         
       //  console.log(bal + 'BTC')

       btcs138[bal]=amt * parseFloat(modular.bids[bal + '/BTC'].default)
       } catch (err) {
         try {
       btcs138[bal]=amt * parseFloat(modular.bids[bal + '/ETH'].default) * parseFloat(btcs2['ETH'])
       } catch (err) {
         try {
       btcs138[bal]= amt * parseFloat(modular.bids[bal + '/BNB'].default) * parseFloat(btcs2['BNB'])
       } catch (err) {
         if (bal == 'BTC'){
         btcs138[bal]=amt
         }
       }}}
       }
       
     }
     let total = 0;
     for (var b in btcs138){
       total+=(btcs138[b])
       }
       console.log(total)
       let total2 = total
       btcstart = total2
       console.log('btcs2[' + btcs2['ETH'])
             usdstart = total2 * parseFloat(btcs['BTC'])
             altstart = usdstart / parseFloat(btcs2['ETH'])

            thetotals=([{usdstart: usdstart, btcstart: btcstart, altstart: altstart}])
  
}
setInterval(function(){
  getthebals()
}, 10000)
let thetotals;
async function dostarts(){
  let bals = await kucoin.fetchBalance();
  myBals = bals
     for (var bal in myBals){
       
       if (parseFloat(myBals[bal].total) != 0 && Object.keys(modular.bids).length > 5){
       let amt = parseFloat(myBals[bal].total)
       try {
         
       //  console.log(bal + 'BTC')

       btcs138[bal]=amt * parseFloat(modular.bids[bal + '/BTC'].default)
       } catch (err) {
         try {
       btcs138[bal]=amt * parseFloat(modular.bids[bal + '/ETH'].default) * parseFloat(btcs2['ETH'])
       } catch (err) {
         try {
       btcs138[bal]= amt * parseFloat(modular.bids[bal + '/BNB'].default) * parseFloat(btcs2['BNB'])
       } catch (err) {
         if (bal == 'BTC'){
         btcs138[bal]=amt
         }
       }}}
       }
       
     }
     let total = 0;
     for (var b in btcs138){
       total+=(btcs138[b])
       }
       console.log(total)
       let total2 = total
       btcstart = total2
       console.log('btcs2[' + btcs2['ETH'])
             usdstart = total2 * parseFloat(btcs['BTC'])
             altstart = usdstart / parseFloat(btcs2['ETH'])

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
}, 200  )
setTimeout(function(){
    if (dodo){
    dostarts()
}
}, 10000)
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




module.exports.exchangeOpenOrders = async function exchangeOpenOrders(){
  
  return await kucoin.fetchOpenOrders()
}
module.exports.exchangeOpenOrdersBySymbol = async function exchangeOpenOrdersBySymbol(symbol){
  return await kucoin.fetchOpenOrders(symbol, since, limit)

}
module.exports.exchangeCancelOrder = async function exchangeCancelOrder(order){
 console.log('cancel')
 await kucoin.cancelOrder(order.id)

}
module.exports.doob =async function doob(tickVols, t){
  let t2 = tickVols[t]
  console.log(t2)
  let ob =  await kucoin.fetchOrderBook(t2, 10);
thebooks[t2] = {asks: ob.asks, bids: ob.bids}
setTimeout(function(){
  if (t == tickVols.length -1){
    t = -1;
  }
  doob(tickVols, t+1)
},1000)
}
let first = true;
module.exports.exchangeCandlesAndBooks = async function exchangeCandlesAndBooks(tickVols){

        if(kucoin.has['fetchOHLCV'] == 'emulated'){
          for (var t in tickVols){
          
      let since = kucoin.milliseconds () - 86400000 / 2
    let limit = 24;
          candles[t]=tickVols[t]
          let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms));

        }
        }else {
          for (var t in tickVols){
          let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms));

                  await sleep (kucoin.rateLimit) // milliseconds

        let candles2 =  (await kucoin.fetchOHLCV (t, '1h', since, limit)) // one minute
        let candle = candles2[candles2.length-1]
        candles[t] = candle[5]
}

}
}

async function setBal(){

  let balances =  await kucoin.fetchBalance();
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
  let balances = await kucoin.fetchBalance();
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
  let balances = await kucoin.fetchBalance();
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
  let since = kucoin.milliseconds () - 86400000
    let limit = 100;
    console.log('trades ' + symbol)
 let trades = await kucoin.fetchMyTrades (symbol, since, limit)

            modular.ts[symbol] = (trades)

            for (var t in trades) {
console.log(trades[t])
                if (!tradeids.includes(trades[t].id + trades[t].timestamp) && parseFloat(trades[t].timestamp) > starttime2) {

                    tradeids.push(trades[t].id + trades[t].timestamp);
                    trades2.push({
                        'commission': trades[t].cost,
                        'quoteQty': trades[t].cost,
                        'symbol': trades[t].symbol,
                        'qty': trades[t].amount,
                        'price': trades[t].price,
                        'isBuyer': trades[t].side,
                        'time': trades[t].timestamp
                    })

                    if (trades[t].symbol != 'ETHBTC' && trades[t].symbol != 'USDBTC' && trades[t].symbol != 'BTCUSD') {
                        if (trades[t].symbol.substring(trades[t].symbol.length - 4, trades[t].symbol.length).startsWith('USD') || trades[t].symbol.substring(trades[t].symbol.length - 3, trades[t].symbol.length).startsWith('USD')) {
                            btcVol+= parseFloat(trades[t].cost) / btcs['BTC']
                        } else if (trades[t].symbol.substring(trades[t].symbol.length - 3, trades[t].symbol.length) == 'ETH') {
                            btcVol+= parseFloat(trades[t].cost) * btcs['ETH']
                        } else if (trades[t].symbol.substring(trades[t].symbol.length - 3, trades[t].symbol.length) == 'BTC') {

                            btcVol+= ((parseFloat(trades[t].cost)))
                        } else if (trades[t].symbol.substring(trades[t].symbol.length - 3, trades[t].symbol.length) == 'BNB') {
                            btcVol+= (((parseFloat(trades[t].cost) * btcs['BNB'])))
                        }
                        console.log(btcVol)
                    }
                    if (trades[t].timestamp > actualstarttime) {
                   //     //console.log(trades[t])
                        if (trades[t].isBuyer == 'buy') {
                            let symbol = trades[t].symbol
                            if (!Number.isNaN(parseFloat(trades[t].amount))){
                            if (buyOs[symbol] == undefined) {
                                buyOs[symbol] = []
                            }
                            modular.dontgo2[trades[t].symbol] = true
                            modular.settimeoutdontgo(trades[t].symbol)
                            if (true) {

                                if (modular.avgBids[symbol] > 0.00000000000000000001) {
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (minProfit),
                                        qty: parseFloat(trades[t].amount)
                                    });
                                } else {
                                    modular.avgBids[symbol] = parseFloat(bp);
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (minProfit),
                                        qty: parseFloat(trades[t].amount)
                                    })
                                }
                            } else {
                                if (modular.avgBids[symbol] > 0.00000000000000000001) {
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (minProfit),
                                        qty: parseFloat(trades[t].amount)
                                    })
                                } else {
                                    modular.avgBids[symbol] = parseFloat(bp);
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (minProfit),
                                        qty: parseFloat(trades[t].amount)
                                    })
                                }
                            }
                            //dontbuy[trades[t].symbol] = true
                            //console.log(symbol)
                            //console.log(buyOs[symbol])
                        }
                        } else {
                            for (var buyo in buyOs[trades[t].symbol]) {
                                if (buyOs[trades[t].symbol][buyo].price < parseFloat(trades[t].price)) {
                                    //console.log(trades[t].symbol + ' buyos slice: ')
                                    //console.log( buyOs[trades[t].symbol][buyo])
                                    buyOs[trades[t].symbol].splice(buyo, 1);

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
  console.log('exinfo')
  let exchange = (await kucoin.fetchMarkets())
    for (var ex in exchange) {
        let symbol = exchange[ex].symbol
        filters[symbol] = {
            'minPrice': parseFloat(0),
            'minQty': parseFloat(1),
            'tickSize': modular.countDecimalPlaces(parseFloat(exchange[ex].info.tickSize)),
            'stepSize': modular.countDecimalPlaces(parseFloat(exchange[ex].info.lotSize)),
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
  let o = await kucoin.createOrder (symbol, type.toLowerCase(), side.toLowerCase(), qty, price)
  console.log(o)
  return(o)
}
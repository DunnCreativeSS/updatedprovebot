module.exports = {

};

let modular = require('./modular.js')
const Binance = require('binance-api-node').default
let apikey
if (process.env.binApiKey == undefined){
  apikey = "XGjzcjFqDgd06qg6fNpjAIUzzebrbURXup3Z7P1OCXBoq8SoFvnYV0pgCoN69gbG"
}   else {
  apikey = process.env.binApiKey
}
let apisecret
if (process.env.binApiSecret == undefined){
  apisecret = "yZ1oFZFGkJjn3CPK9XsRkuJXQJzKohZPhhv6Jz5GmcsAN1cOVevEWeSLJPBNzlYM"
}   else {
  apisecret = process.env.binApiSecret
}
const client = Binance({
    apiKey: apikey,
    apiSecret: apisecret
})
var ccxt = require("ccxt");

let bin  = new ccxt.binance ({ 'enableRateLimit': true, apiKey: apikey, secret: apisecret })
const binance = Binance({
    apiKey: '',
    apiSecret: ''
})
let bids = []
let asks = []
binance.ws.allTickers(tickers => {
    for (var t in tickers) {
        if (asks[tickers[t].symbol] == undefined) {
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
        modular.asks[tickers[t].symbol]['default'] = tickers[t].bestAsk
        modular.bids[tickers[t].symbol]['default'] = tickers[t].bestBid
    }
})
let thetotals;
let thebooks = {}
let candles = {}
const express = require('express');
const app = express();

app.get('/thetotals', (req, res) => {
    res.json(thetotals)
});
app.get('/trades2', (req, res) => {
    res.json(trades2)
});
app.get('/filters', (req, res) => {
    res.json(filters)
});
app.get('/btcVol', (req, res) => {
    res.json({'btcVol':btcVol})
});
app.get('/starts', (req, res) => {
    res.json(starts)
});
app.get('/bals', (req, res) => {
    res.json(bals)
});
app.get('/bidsasks', (req, res) => {
    res.json({bids: bids, asks: asks})
});
app.get('/eths', (req, res) => {
    res.json(eths)
});
app.get('/btcs', (req, res) => {
    res.json(btcs)
});
app.get('/btcs2', (req, res) => {
    res.json(btcs2)
});
app.get('/buyOs', (req, res) => {
    res.json(buyOs)
});
let buyOs = {}
let btcs2 = {}
let btcs138 = {}
let bals = {}
let starts = []
let usdstart = 0;
let altstart = 0;
let btcstart = 0;
app.get('/spreads', (req, res) => {
    res.json(spreads)
});
app.get('/candles', (req, res) => {
    res.json(candles)
});
app.get('/thebooks', (req, res) => {
    res.json(thebooks)
});
let totalold
app.listen(process.env.binPORT2 || 8082, function() {});
function comp(array1, array2) {
    var hash = {};
    array2.forEach(function(a) {
        hash[Math.sqrt(a).toString()] = true;
    });
    return array1.filter(function (a) {
        return hash[a];
    });
}

async function setBal(){

  let balances = (await client.accountInfo()).balances
  let bals138 = {}
    for (var b in balances) {

            bals138[balances[b].asset] = parseFloat(balances[b].free) + parseFloat(balances[b].locked)
        
    }
    return bals138;
}
let  bals2 = {}
let dodo = true;
setBal()
let myBals;
let btcs = {}
let eths = {}
let candies = []

async function getthebals(){
  btcs138 = {}
  let bals = await bin.fetchBalance();
  bals  =(bals.info.balances)
  myBals = bals
    for (var bal in myBals){
       let amt = parseFloat(myBals[bal].free)+parseFloat(myBals[bal].locked)
         if (amt != 0 && Object.keys(modular.asks).length > 5){
       
       modular.bases.unshift('BTC')
       for (var b in modular.bases){
       //  //console.log(bal + 'BTC')
if ((modular.asks[myBals[bal].asset + '' + modular.bases[b]]) != undefined){
  if (myBals[bal].asset == 'BTC'){
    btcs138[myBals[bal].asset] = amt
  }
 if (modular.bases[b] == 'BTC'){
       btcs138[myBals[bal].asset]=amt * parseFloat(modular.asks[myBals[bal].asset + '' + modular.bases[b]].default)
        }
        else {
          if (btcs2[modular.bases[b]] != undefined&& btcs138[myBals[bal].asset] == undefined){
       btcs138[myBals[bal].asset]=amt * parseFloat(modular.asks[myBals[bal].asset + '' + modular.bases[b]].default) / parseFloat(btcs2[modular.bases[b]])
}
        }}       }
       
     }
       
     }
     let total = 0;
     for (var b in btcs138){
       total+=(btcs138[b])
       }
       //console.log(total)
       let total2 = total
       btcstart = total2
       //console.log('btcs2[' + btcs2['ETH'])
             usdstart = total2 * parseFloat(btcs['BTC'])
             altstart = usdstart / parseFloat(btcs2['ETH'])

            thetotals=([{usdstart: usdstart, btcstart: btcstart, altstart: altstart}])
  
}
setInterval(function(){
  getthebals()
}, 10000)
async function dostarts(){
  let bals = await bin.fetchBalance();
  bals  =(bals.info.balances)
  myBals = bals
     for (var bal in myBals){
       let amt = parseFloat(myBals[bal].free)+parseFloat(myBals[bal].locked)
         if (amt != 0 && Object.keys(modular.asks).length > 5){
              modular.bases.unshift('BTC')

       for (var b in modular.bases){
       //  //console.log(bal + 'BTC')
if ((modular.asks[myBals[bal].asset + '' + modular.bases[b]]) != undefined){
  if (myBals[bal].asset == 'BTC'){
    btcs138[myBals[bal].asset] = amt
  }
 if (modular.bases[b] == 'BTC'){
       btcs138[myBals[bal].asset]=amt * parseFloat(modular.asks[myBals[bal].asset + '' + modular.bases[b]].default)
        }
        else {
          if (btcs2[modular.bases[b]] != undefined&& btcs138[myBals[bal].asset] == undefined){
            
       btcs138[myBals[bal].asset]=amt * parseFloat(modular.asks[myBals[bal].asset + '' + modular.bases[b]].default) * parseFloat(btcs2[modular.bases[b]])
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
}, 30000  )
client.ws.allTickers(tickers => {
    for (var t in tickers) {
        if (tickers[t].symbol == 'ETHBTC') {
            btcs['ETH'] = tickers[t].bestBid;
        } else if (tickers[t].symbol == 'BNBBTC') {
            btcs['BNB'] = tickers[t].bestBid;
        }
        let symbol = tickers[t].symbol;
        let asset;

        if (symbol.substring(symbol.length - 3, symbol.length) == 'ETH') {

            asset = symbol.substring(0, symbol.length - 3)


            if (true) {
eths[asset] = parseFloat(tickers[t].bestBid)
            }

        }
        if (symbol.substring(symbol.length - 3, symbol.length) == 'BTC') {

            asset = symbol.substring(0, symbol.length - 3)


            if (true) {
                btcs[asset] = parseFloat(tickers[t].bestBid)
            }

        }

        if (tickers[t].symbol == 'BTCUSDT') {

            for (b in btcs) {
                btcs2[b] = btcs[b]
            }
            btcs['BTC'] = parseFloat(tickers[t].bestBid);
        }
        let spread = (100 * (1 - parseFloat(tickers[t].bestBid) / parseFloat(tickers[t].bestAsk)))
        spreads[tickers[t].symbol] = spread;
        modular.tickVols[tickers[t].symbol] = (parseFloat(tickers[t].volumeQuote))
        
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
                    if (tickers[t].symbol.substring(tickers[t].symbol.length - 4, tickers[t].symbol.length) == modular.bases[b]) {
                        modular.vols[modular.bases[b]] += (parseFloat(tickers[t].volumeQuote));
                        modular.cs[modular.bases[b]]++;
                    } else if (tickers[t].symbol.substring(tickers[t].symbol.length - 3, tickers[t].symbol.length) == modular.bases[b]) {
                        modular.vols[modular.bases[b]] += (parseFloat(tickers[t].volumeQuote));
                        modular.cs[modular.bases[b]]++;
                    }
                }

            }

        }
    }
})

let spreads = {}
setInterval(async function(){
 let balances = (await client.accountInfo()).balances

    for (var b in balances) {

            modular.bals3[balances[b].asset] = parseFloat(balances[b].free)
            modular.bals4[balances[b].asset] = parseFloat(balances[b].locked)
            modular.balscombined[balances[b].asset] = parseFloat(balances[b].free) + parseFloat(balances[b].locked)
            bals[balances[b].asset] = parseFloat(balances[b].free) + parseFloat(balances[b].locked)
        
    }
}, 15000);
client.ws.user(msg => {
    let balances = (msg.balances)

    for (var b in balances) {

            modular.bals3[balances[b].asset] = parseFloat(balances[b].free)
            modular.bals4[balances[b].asset] = parseFloat(balances[b].locked)
            modular.balscombined[balances[b].asset] = parseFloat(balances[b].free) + parseFloat(balances[b].locked)
            bals[balances[b].asset] = parseFloat(balances[b].free) + parseFloat(balances[b].locked)
        }
    ////////////console.log(balscombined)
})


module.exports.exchangeOpenOrders = async function exchangeOpenOrders(){
  return (await client.openOrders())
  
}
module.exports.exchangeOpenOrdersBySymbol = async function exchangeOpenOrdersBySymbol(symbol){
  return (await client.openOrders({
      symbol: symbol,
  }))
}
module.exports.exchangeCancelOrder = async function exchangeCancelOrder(order){
//console.log(order.symbol)
//console.log(order.orderId)
return (await client.cancelOrder({
    symbol: order.symbol,
    orderId: order.orderId,
}))
}

module.exports.exchangeCandlesAndBooks = async function exchangeCandlesAndBooks(t){
  
    binance.ws.candles(t, '1h', candle => {
    candles[candle.symbol] = candle.quoteVolume;
  })
   binance.ws.partialDepth({
        symbol: t,
        level: 20
    }, depth => {
        ////////////console.log('thebooks ' + depth.symbol);
        thebooks[depth.symbol] = {
            asks: depth.asks,
            bids: depth.bids
        }
    })
}
module.exports.alt = "BNB";
module.exports.exchangeUpdateBalances = async function exchangeUpdateBalances(){
  
  let balances = (await client.accountInfo()).balances

  for (var b in balances) {

          modular.bals3[balances[b].asset] = parseFloat(balances[b].free)
          modular.bals4[balances[b].asset] = parseFloat(balances[b].locked)
          modular.balscombined[balances[b].asset] = parseFloat(balances[b].free) + parseFloat(balances[b].locked)
          bals[balances[b].asset] = parseFloat(balances[b].free) + parseFloat(balances[b].locked)
      
  }
}
let tradeids = []
let trades2 = []
let btcVol = 0;
module.exports.exchangeDoTrades = async function exchangeDoTrades(symbol){
  let trades = (await client.myTrades({
                symbol: symbol,
            }))
            modular.ts[symbol] = (trades)

            for (var t in trades) {

                if (!tradeids.includes(trades[t].id + trades[t].time + trades[t].orderId) && parseFloat(trades[t].time) > starttime2) {

                    tradeids.push(trades[t].id + trades[t].time + trades[t].orderId);
                    trades2.push({
                        'commission': trades[t].commission,
                        'commissionAsset': trades[t].commissionAsset,
                        'quoteQty': trades[t].quoteQty,
                        'symbol': trades[t].symbol,
                        'qty': trades[t].qty,
                        'price': trades[t].price,
                        'isBuyer': trades[t].isBuyer,
                        'time': trades[t].time
                    })

                    if (trades[t].symbol != 'ETHBTC' && trades[t].symbol != 'USDBTC' && trades[t].symbol != 'BTCUSD') {
                        if (trades[t].symbol.substring(trades[t].symbol.length - 4, trades[t].symbol.length).startsWith('USD') || trades[t].symbol.substring(trades[t].symbol.length - 3, trades[t].symbol.length).startsWith('USD')) {
                            btcVol+= parseFloat(trades[t].quoteQty) / btcs['BTC']
                        } else if (trades[t].symbol.substring(trades[t].symbol.length - 3, trades[t].symbol.length) == 'ETH') {
                            btcVol+= parseFloat(trades[t].quoteQty) * btcs['ETH']
                        } else if (trades[t].symbol.substring(trades[t].symbol.length - 3, trades[t].symbol.length) == 'BTC') {

                            btcVol+= ((parseFloat(trades[t].quoteQty)))
                        } else if (trades[t].symbol.substring(trades[t].symbol.length - 3, trades[t].symbol.length) == 'BNB') {
                            btcVol+= (((parseFloat(trades[t].quoteQty) * btcs['BNB'])))
                        }
                        ////console.log(btcVol)
                    }
                    if (trades[t].time > actualstarttime) {
                   //     //////console.log(trades[t])
modular.renew[trades[t].symbol] = true;
                        if (trades[t].isBuyer) {
                            let symbol = trades[t].symbol
                            if (!Number.isNaN(parseFloat(trades[t].qty))){
                            if (buyOs[symbol] == undefined) {
                                buyOs[symbol] = []
                            }
                            //modular.dontgo2[trades[t].symbol] = true
                            //modular.settimeoutdontgo(trades[t].symbol)
                            if (true){//usddiff != usddiff2) {

                                if (modular.avgBids[symbol] > 0.00000000000000000001) {
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (modular.minProfit),
                                        qty: parseFloat(trades[t].qty)
                                    });
                                } else {
                                    modular.avgBids[symbol] = parseFloat(bp);
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (modular.minProfit),
                                        qty: parseFloat(trades[t].qty)
                                    })
                                }
                            } else {
                                if (modular.avgBids[symbol] > 0.00000000000000000001) {
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (modular.minProfit),
                                        qty: parseFloat(trades[t].qty)
                                    })
                                } else {
                                    modular.avgBids[symbol] = parseFloat(bp);
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (modular.minProfit),
                                        qty: parseFloat(trades[t].qty)
                                    })
                                }
                            }
                            //dontbuy[trades[t].symbol] = true
                            //////console.log(symbol)
                            //////console.log(buyOs[symbol])
                        }
                        } else {
                            for (var buyo in buyOs[trades[t].symbol]) {
                                if (buyOs[trades[t].symbol][buyo].price *  modular.divisor[symbol] < parseFloat(trades[t].price)) {
                                    //////console.log(trades[t].symbol + ' buyos slice: ')
                                    //////console.log( buyOs[trades[t].symbol][buyo])
                                    buyOs[trades[t].symbol].splice(buyo, 1);

                                }
                            }
                        }
                    }
                   
                }
            }
}
let actualstarttime = new Date().getTime()
let starttime2 = new Date().getTime();
let filters = {}
module.exports.exchangeInfo = async function exchangeInfo(){
  let exchange = (await client.exchangeInfo())
    for (var symbol in exchange.symbols) {
        modular.precisions[exchange.symbols[symbol].symbol] = {
            'base': exchange.symbols[symbol].baseAsset,
            'quote': exchange.symbols[symbol].quoteAsset,
            'bp': exchange.symbols[symbol].baseAssetPrecision,
            'qp': exchange.symbols[symbol].quotePrecision
        }
        filters[exchange.symbols[symbol].symbol] = {
            'minPrice': parseFloat(exchange.symbols[symbol].filters[0].minPrice),
            'minQty': parseFloat(exchange.symbols[symbol].filters[2].minQty),
            'tickSize': modular.countDecimalPlaces(parseFloat(exchange.symbols[symbol].filters[0].tickSize)),
            'stepSize': modular.countDecimalPlaces(parseFloat(exchange.symbols[symbol].filters[2].stepSize)),
            'minNotional': parseFloat(exchange.symbols[symbol].filters[3].minNotional)
        }
    }
}

module.exports.exchangeOrder = async function exchangeOrder(symbol, side, qty, price, type){

return (await client.order({
    symbol: symbol,
    side: side,
    quantity: qty,
    price: price,
    type: type
}))
    

}

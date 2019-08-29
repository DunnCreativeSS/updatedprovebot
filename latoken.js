module.exports = {

};var tickVols = {}
const BitMEXClient = require('bitmex-realtime-api');
// See 'options' reference below
const client = new BitMEXClient({testnet: true});

var bids = {}
var asks = {}
var avgBids = {}
var crypto = require('crypto');
var request = require('request')
let modular = require('./modular.js')
var ccxt = require("ccxt");
let apiKey = 'AAb8HWz-y3z8pMw8U-r5PL73'
let apiSecret = 'CgQ1m3g4coPcmtqIBuCxcbRMMoK9R_f_NQQ-_Pl8Rh2-ZmmL'
let bitmex  = new ccxt.bitmex ({ 'enableRateLimit': true, apiKey: "AAb8HWz-y3z8pMw8U-r5PL73", secret: "CgQ1m3g4coPcmtqIBuCxcbRMMoK9R_f_NQQ-_Pl8Rh2-ZmmL" })
bitmex.urls['api'] = bitmex.urls['test'];


setTimeout(async function(){
  let tickers = await bitmex.fetchTickers()
  for (var t in tickers) {
      if (tickers[t].symbol.includes('U19') && !tickers[t].symbol.includes('XBT') && tickers[t].symbol != 'TRXU19'){
        client.addStream(tickers[t].symbol, 'instrument', function (data, symbol, tableName) {
            if (!data.length) return;
            const quote = data[data.length - 1];  // the last data element is the newest quote
            // Do something with the quote (.bidPrice, .bidSize, .askPrice, .askSize)
        //console.log(quote)
          
    if (modular.asks[symbol] == undefined) {
            modular.asks[symbol] = {}
            modular.bids[symbol] = {}
            asks[symbol] = {}
            bids[symbol] = {}
        }
        let pair;
        if (symbol.substring(symbol.length - 4, symbol.length).startsWith('USD')) {
            pair = symbol.substring(0, symbol.length - 4) + '/' + symbol.substring(symbol.length - 4, symbol.length);
        } else {
            pair = symbol.substring(0, symbol.length - 3) + '/' + symbol.substring(symbol.length - 3, symbol.length);

        }
        if (!modular.pairs.includes(pair)) {
            modular.pairs.push(pair);
        }
        modular.asks[symbol]['default'] = quote.askPrice
        modular.bids[symbol]['default'] = quote.bidPrice
        asks[symbol]['default'] = quote.askPrice
        bids[symbol]['default'] = quote.bidPrice
        
        if (symbol == 'ETH/USD') {
            btcs['ETH'] = quote.bidPrice;
        } else if (symbol == 'BNBBTC') {
            btcs['BNB'] = quote.bidPrice;
        }
        let asset;
        if (symbol.substring(symbol.length - 3, symbol.length) == 'BTC') {

            asset = symbol.substring(0, symbol.length - 3)


            if (asset != 'ETH' && asset != 'BTC' && asset != 'USD' && asset != 'BNB') {
                btcs[asset] = parseFloat(quote.bidPrice)
            }

        }

        if (symbol == 'BTC/USD') {

            for (b in btcs) {
                btcs2[b] = btcs[b]
            }
            btcs['BTC'] = parseFloat(quote.bidPrice);
        }
        let spread = (100 * (1 - parseFloat(quote.bidPrice) / parseFloat(quote.askPrice)))
        spreads[symbol] = spread;
        modular.tickVols[symbol] = (parseFloat(quote.volume24h))
        tickVols[symbol] = (parseFloat(quote.volume24h))
        if (!modular.ticks.includes(symbol) && spread) {
            //spreads[symbol] = spread;
            //tickVols[symbol] = (parseFloat(quote.volumeQuote))
            if (symbol.substring(symbol.length - 4, symbol.length).includes('USD')) {
                if (!modular.bases.includes(symbol.substring(symbol.length - 4, symbol.length))) {
                    modular.bases.push(symbol.substring(symbol.length - 4, symbol.length))
                }
            } else {
                if (!modular.bases.includes(symbol.substring(symbol.length - 3, symbol.length))) {
                    modular.bases.push(symbol.substring(symbol.length - 3, symbol.length))
                }
            }
            modular.ticks.push(symbol)
            for (var t in tickers) {
                for (b in modular.bases) {
                    if (modular.vols[modular.bases[b]] == undefined) {
                        modular.vols[modular.bases[b]] = 0;
                        modular.cs[modular.bases[b]] = 0;
                    }
                    if (symbol.substring(symbol.length - 4, symbol.length) == modular.bases[b]) {
                        modular.vols[modular.bases[b]] += (parseFloat(quote.volume24h));
                        modular.cs[modular.bases[b]]++;
                    } else if (symbol.substring(symbol.length - 3, symbol.length) == modular.bases[b]) {
                        modular.vols[modular.bases[b]] += (parseFloat(quote.volume24h));
                        modular.cs[modular.bases[b]]++;
                    }
                }

            }

        }  });
    }
    }
        
    
}, 1000)
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
app.get('/buyOs', (req, res) => {
    res.json(buyOs)
});

app.get('/thetotals', (req, res) => {
    res.json(thetotals)
});
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
app.get('/avgBids', (req, res) => {
    res.json(avgBids)
});
app.get('/asks', (req, res) => {
    res.json(asks)
});
app.get('/bids', (req, res) => {
    res.json(bids)
});
app.get('/tickVols', (req, res) => {
    res.json(tickVols)
});

app.listen(process.env.binPORT || 3001, function() {});

let candies = []



let spreads = {}




module.exports.exchangeOpenOrders = async function exchangeOpenOrders(){
  
  
}
module.exports.exchangeOpenOrdersBySymbol = async function exchangeOpenOrdersBySymbol(symbol){
  return await bitmex.fetchOpenOrders(symbol, since, limit)

}
module.exports.exchangeCancelAll = async function exchangeCancelAll(){

    
    var verb = 'DELETE',
      path = '/api/v1/order/all',
      expires = Math.round(new Date().getTime() / 1000) + 60, // 1 min in the future
      data = {};
    
    // Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
    // and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
    var postBody = JSON.stringify(data);
    
    var signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');
    
    var headers = {
      'content-type' : 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
      // https://www.bitmex.com/app/apiKeysUsage for more details.
      'api-expires': expires,
      'api-key': apiKey,
      'api-signature': signature
    };
    
    const requestOptions = {
      headers: headers,
      url:'https://testnet.bitmex.com'+path,
      method: verb,
      body: postBody
    };
    
    request(requestOptions, function(error, response, body) {
      if (error) { console.log(error); }
      console.log(body);
    });
    
}
module.exports.exchangeCancelOrder = async function exchangeCancelOrder(order){
  await bitmex.cancelOrder(order.info.orderID)

}
module.exports.exchangeCancelOrder = async function exchangeCancelOrder(symbol, orderId){
  
  await bitmex.cancelOrder(orderId)

}

module.exports.exchangeCandlesAndBooks = async function exchangeCandlesAndBooks(t){
    console.log(t)
      let since = bitmex.milliseconds () - 86400000
    let limit = 24;
let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms));
        //await sleep (bitmex.rateLimit) // milliseconds
        let candles2 =  (await bitmex.fetchOHLCV (t, '1h', since, limit)) // one minute
        let candle = candles2[candles2.length-2]
       
        candles[t] = candle[5]

let ob =  await bitmex.fetchOrderBook(t, 10);
thebooks[t] = {asks: ob.asks, bids: ob.bids}

}
let thetotals
module.exports.alt = "ETH";
setInterval(async function(){
  let balances = await bitmex.fetchBalance();
  thetotals = {'usdstart': balances.BTC.free}

  bals = {}
    let coins = ['ETH', 'BTC']
  for (var b in coins){
    if (balances[coins[b]] != undefined){
      if (parseFloat(balances[coins[b]].free) > 0 || parseFloat(balances[coins[b]].total) > 0) {
          modular.bals3[coins[b]] = parseFloat(balances[coins[b]].free)
          modular.bals4[coins[b]] = parseFloat(balances[coins[b]].total) - parseFloat(balances[coins[b]].free)
          modular.balscombined[coins[b]] = parseFloat(balances[coins[b]].total)
          bals[coins[b]] = parseFloat(balances[coins[b]].total)
      }
    }
  }
  }, 10000);
module.exports.exchangeUpdateBalances = async function exchangeUpdateBalances(){
  setInterval(async function(){
  let balances = await bitmex.fetchBalance();
  bals = {}
    let coins = ['ETH', 'BTC']
  for (var b in coins){
    if (balances[coins[b]] != undefined){
      if (parseFloat(balances[coins[b]].free) > 0 || parseFloat(balances[coins[b]].total) > 0) {
          modular.bals3[coins[b]] = parseFloat(balances[coins[b]].free)
          modular.bals4[coins[b]] = parseFloat(balances[coins[b]].total) - parseFloat(balances[coins[b]].free)
          modular.balscombined[coins[b]] = parseFloat(balances[coins[b]].total)
          bals[coins[b]] = parseFloat(balances[coins[b]].total)
      }
    }
  }
  }, 10000);
}
let tradeids = []
let trades2 = []
let btcVol = 0;
module.exports.exchangeDoTrades = async function exchangeDoTrades(symbol){
 let trades = await bitmex.private_get_position({'symbol':symbol})

            modular.ts[symbol] = (trades)

            for (var t in trades) {
console.log(trades[t])
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
                        console.log(btcVol)
                    }
                    if (trades[t].time > actualstarttime) {
                   //     //console.log(trades[t])
                        if (trades[t].isBuyer) {
                            let symbol = trades[t].symbol
                            if (!Number.isNaN(parseFloat(trades[t].qty))){
                            if (buyOs[symbol] == undefined) {
                                buyOs[symbol] = []
                            }
                            modular.dontgo2[trades[t].symbol] = true
                            modular.settimeoutdontgo(trades[t].symbol)
                            if (usddiff != usddiff2) {

                                if (modular.avgBids[symbol] > 0.00000000000000000001) {
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (minProfit),
                                        qty: parseFloat(trades[t].qty)
                                    });
                                } else {
                                    modular.avgBids[symbol] = parseFloat(bp);
                                    avgBids[symbol] = parseFloat(bp);
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (minProfit),
                                        qty: parseFloat(trades[t].qty)
                                    })
                                }
                            } else {
                                if (modular.avgBids[symbol] > 0.00000000000000000001) {
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (minProfit),
                                        qty: parseFloat(trades[t].qty)
                                    })
                                } else {
                                    modular.avgBids[symbol] = parseFloat(bp);
                                    avgBids[symbol] = parseFloat(bp);
                                    buyOs[symbol].push({
                                        price: parseFloat(trades[t].price) * (minProfit),
                                        qty: parseFloat(trades[t].qty)
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
  let exchange = (await bitmex.fetchMarkets())
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
    console.log(Math.floor(qty))
    console.log(price)
    console.log(type)
    verb = 'POST',
    path = '/api/v1/order',
    expires = Math.round(new Date().getTime() / 1000) + 6660 // 1 min in the future
    if (side.toLowerCase() == 'sell'){
    data = {
        symbol: symbol,
        orderQty: -1 * Math.floor(qty),
        ordType: "Limit",
        price: price
    };
}
else {
    data = {
        symbol: symbol,
        orderQty: Math.floor(qty),
        ordType: "Limit",
        price: price
    };
}
// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
postBody = JSON.stringify(data);
signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');
headers = {
    'content-type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'api-expires': expires,
    'api-key': apiKey,
    'api-signature': signature
};
requestOptions = {
    headers: headers,
    url: 'https://testnet.bitmex.com' + path,
    method: verb,
    body: postBody
};
    request(requestOptions, function(error, response, body) {
        if (error) {
            console.log(error);
        }
    })
    return(0)
}
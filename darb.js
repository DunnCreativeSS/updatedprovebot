module.exports = {

};
let request = require('request')
let modular = require('./modular.js')
let apikey
if (process.env.binApiKey == undefined) {
    apikey = "2LqWm2Xnv7XN8KFLW8LA98XFwN7Vj8jlTZIHcp5Xxbv5wAQTIldRtBgqXnMHv63P"
} else {
    apikey = process.env.binApiKey
}
let apisecret
if (process.env.binApiSecret == undefined) {
    apisecret = "fMgIClpANlFKvfmESQgMbND9BZR6fUWLpDd2yTCMERgA7TOZt5vVR8eci6iNaFjQ"
} else {
    apisecret = process.env.binApiSecret
}
let pairs = []
request.get("https://api.darbfinance.com/api/v1/exchangeInfo", {}, async function(e, r, data) {
  data = JSON.parse(data)
  for (var p in data.pairs) {

      pairs.push(p)
  }
  for (var p in data.pairs) {
      if (!modular.bases.includes(p.substring(p.length - 3, p.length))) {
          modular.bases.push(p.substring(p.length - 3, p.length))
      }
  }
})
let bals138 = {}
  let bids = []
  let asks = []
  setInterval(async function() {
      for (var t in pairs) {
          dopairst(pairs, t)
      }
  }, 5000)
  async function dopairst(pairs, t){
    await request.get('https://api.darbfinance.com/api/v1/ticker/bookTicker?symbol=' + pairs[t], {}, async function(e, r, data2) {
              data2 = JSON.parse(data2)
              if (asks[data2.symbol] == undefined) {
                  modular.asks[data2.symbol] = {}
                  modular.bids[data2.symbol] = {}
              }
              let pair;
              if (data2.symbol.substring(data2.symbol.length - 4, data2.symbol.length).startsWith('USD')) {
                  pair = data2.symbol.substring(0, data2.symbol.length - 4) + '/' + data2.symbol.substring(data2.symbol.length - 4, data2.symbol.length);
              } else {
                  pair = data2.symbol.substring(0, data2.symbol.length - 3) + '/' + data2.symbol.substring(data2.symbol.length - 3, data2.symbol.length);

              }
              if (!modular.pairs.includes(pair)) {
                  modular.pairs.push(pair);
              }
              modular.asks[data2.symbol]['default'] = data2.askPrice
              modular.bids[data2.symbol]['default'] = data2.bidPrice
              
              let symbol = data2.symbol;
              let asset;

              if (symbol.substring(symbol.length - 3, symbol.length) == 'ETH') {

                  asset = symbol.substring(0, symbol.length - 3)


                  if (true) {
                      eths[asset] = parseFloat(data2.bidPrice)
                  }

              }
              if (symbol.substring(symbol.length - 3, symbol.length) == 'BTC') {

                  asset = symbol.substring(0, symbol.length - 3)


                  if (true) {
                      btcs[asset] = parseFloat(data2.bidPrice)
                  }

              }

              if (data2.symbol == 'BTC-EUR') {
btcs['BTCEUR'] = parseFloat(data2.bidPrice);
}
              if (data2.symbol == 'BTC-USD') {

                  for (b in btcs) {
                      btcs2[b] = btcs[b]
                  }
                  btcs['BTC'] = parseFloat(data2.bidPrice);
              }
              let spread = (100 * (1 - parseFloat(data2.bidPrice) / parseFloat(data2.askPrice)))
              spreads[data2.symbol] = spread;

              if (!modular.ticks.includes(data2.symbol) && spread) {
                  //spreads[data2.symbol] = spread;

                  modular.ticks.push(data2.symbol)
                  console.log('https://api.darbfinance.com/api/v1/ticker/24hr?symbol=' + pairs[t])
                  await request.get('https://api.darbfinance.com/api/v1/ticker/24hr?symbol=' + pairs[t], {}, async function(e, r, data3) {
                      data3 = JSON.parse(data3)
                    modular.tickVols[data3[0].symbol] = data3[0].volume * data3[0].lastPrice
                      if (data3[0] != undefined) {
                          for (var b in modular.bases) {
                              if (data3[0].symbol.substring(data3[0].symbol.length - 3, data3[0].symbol.length) == modular.bases[b]) {
                                  if (modular.vols[modular.bases[b]] == undefined) {
                                      modular.vols[modular.bases[b]] = 0
                                      modular.cs[modular.bases[b]] = 0
                                  }
                                  modular.vols[modular.bases[b]] += data3[0].volume * data3[0].lastPrice
                                  modular.cs[modular.bases[b]]++
                              }
                          }
                      }

                  })
              }
          })
  }
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
      res.json({
          'btcVol': btcVol
      })
  });
  app.get('/starts', (req, res) => {
      res.json(starts)
  });
  app.get('/bals', (req, res) => {
      res.json(bals)
  });
  app.get('/bidsasks', (req, res) => {
      res.json({
          bids: bids,
          asks: asks
      })
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
      return array1.filter(function(a) {
          return hash[a];
      });
  }
  var crypto = require('crypto')

  async function setBal() {
      let ts = new Date().getTime()
      let text = "timestamp=" + ts.toString()
      hash = crypto.createHmac('sha256', apisecret).update(text).digest('hex')
      console.log(hash)
      var options = {
            method: 'GET',
            url: 'https://api.darbfinance.com/api/v1/account?timestamp=' + ts.toString() + '&signature=' + hash,
            headers: {
                "X-MBX-APIKEY": apikey,
                "Content-Type": "application/json"
            }
        };
        //console.log(options)
        request(options, function(error,response,body){
        body = JSON.parse(body)
        for (var b in body.balances){
            bals138[body.balances[b]] = parseFloat(body.balances[b]) + parseFloat(body.balances[b])
        }
          
        });

     /*
      let balances = (await client.accountInfo()).balances
      let bals138 = {}
      for (var b in balances) {

          bals138[body.balances[b]] = parseFloat(body.balances[b]) + parseFloat(body.balances[b])

      }
  */
      return bals138;
  }
  let bals2 = {}
  let dodo = true;
  setBal()
  let myBals;
  let btcs = {}
  let eths = {}
  let candies = []

  async function getthebals() {
      btcs138 = {}
      let ts = new Date().getTime()
      let text = "timestamp=" + ts.toString()
      hash = crypto.createHmac('sha256', apisecret).update(text).digest('hex')
      console.log(hash)
      var options = {
            method: 'GET',
            url: 'https://api.darbfinance.com/api/v1/account?timestamp=' + ts.toString() + '&signature=' + hash,
            headers: {
                "X-MBX-APIKEY": apikey,
                "Content-Type": "application/json"
            }
        };
        //console.log(options)
        request(options, function(error,response,body){
        body = JSON.parse(body)
        for (var b in body.balances){
            bals138[body.balances[b]] = parseFloat(body.balances[b]) + parseFloat(body.balances[b])
        }
          myBals = body.balances
      for (var bal in myBals) {
          let amt = parseFloat(myBals[bal].free) + parseFloat(myBals[bal].locked)
          if (amt != 0 && Object.keys(modular.asks).length > 5) {

              modular.bases.unshift('BTC')
              for (var b in modular.bases) {
                  //  //console.log(bal + 'BTC')
                  if ((modular.asks[myBals[bal].asset + '_' + modular.bases[b]]) != undefined) {
                      if (myBals[bal].asset == 'BTC') {
                          btcs138[myBals[bal].asset] = amt
                      }
                      if (modular.bases[b] == 'BTC') {
                          btcs138[myBals[bal].asset] = amt * parseFloat(modular.asks[myBals[bal].asset + '_' + modular.bases[b]].default)
                      } else {
                          if (btcs2[modular.bases[b]] != undefined && btcs138[myBals[bal].asset] == undefined) {
                              btcs138[myBals[bal].asset] = amt * parseFloat(modular.asks[myBals[bal].asset + '_' + modular.bases[b]].default) / parseFloat(btcs2[modular.bases[b]])
                          }
                      }
                  }
              }

          }

      }
      let total = 0;
      for (var b in btcs138) {
          total += (btcs138[b])
      }
      //console.log(total)
      let total2 = total
      btcstart = total2
      //console.log('btcs2[' + btcs2['ETH'])
      usdstart = total2 * parseFloat(btcs['BTC'])
      altstart = usdstart / parseFloat(btcs2['ETH'])

      thetotals = ([{
          usdstart: usdstart,
          btcstart: btcstart,
          altstart: altstart
      }])

        });
  }
  setInterval(function() {
      getthebals()
  }, 10000)
  async function dostarts() {
      let ts = new Date().getTime()
      let text = "timestamp=" + ts.toString()
      hash = crypto.createHmac('sha256', apisecret).update(text).digest('hex')
      console.log(hash)
      var options = {
            method: 'GET',
            url: 'https://api.darbfinance.com/api/v1/account?timestamp=' + ts.toString() + '&signature=' + hash,
            headers: {
                "X-MBX-APIKEY": apikey,
                "Content-Type": "application/json"
            }
        };
        //console.log(options)
        request(options, function(error,response,body){
        body = JSON.parse(body)
        for (var b in body.balances){
            bals138[body.balances[b]] = parseFloat(body.balances[b]) + parseFloat(body.balances[b])
        }
          myBals = body.balances
      for (var bal in myBals) {if (myBals[bal].asset == 'BTC') {
                        console.log(myBals[bal])
      }
          let amt = parseFloat(myBals[bal].free) + parseFloat(myBals[bal].locked)
          if (amt != 0 && Object.keys(modular.asks).length > 5) {
              modular.bases.unshift('BTC')

              for (var b in modular.bases) {
                  //  //console.log(bal + 'BTC')
                  if ((modular.asks[myBals[bal].asset + '_' + modular.bases[b]]) != undefined) {
                      if (myBals[bal].asset == 'BTC') {
                          btcs138[myBals[bal].asset] = amt
                      }
                      if (modular.bases[b] == 'BTC') {
                          btcs138[myBals[bal].asset] = amt * parseFloat(modular.asks[myBals[bal].asset + '_' + modular.bases[b]].default)
                      } else {
                          if (btcs2[modular.bases[b]] != undefined && btcs138[myBals[bal].asset] == undefined) {

                              btcs138[myBals[bal].asset] = amt * parseFloat(modular.asks[myBals[bal].asset + '_' + modular.bases[b]].default) * parseFloat(btcs2[modular.bases[b]])
                          }
                      }
                      if (myBals[bal].asset == 'BTC') {
                          console.log('asset ' + myBals[bal].asset)
                          console.log('amt ' + amt)
                          console.log(btcs138[myBals[bal].asset])
                      }
                  }
              }

          }

      }
      let total = 0;
      for (var b in btcs138) {
          total += (btcs138[b])
      }
      console.log(total)
      let total2 = total
      btcstart = total2
      altstart = total2 / parseFloat(btcs2['BNB'])
      usdstart = total2 * parseFloat(btcs['BTC'])

      starts = ([{
          usdstart: usdstart,
          btcstart: btcstart,
          altstart: altstart
      }])
      console.log(starts)

  })
  }
  setTimeout(function() {
      dostarts()
  }, 10000)

  let spreads = {}
  setInterval(async function() {
    let ts = new Date().getTime()
      let text = "timestamp=" + ts.toString()
      hash = crypto.createHmac('sha256', apisecret).update(text).digest('hex')
      console.log(hash)
      var options = {
            method: 'GET',
            url: 'https://api.darbfinance.com/api/v1/account?timestamp=' + ts.toString() + '&signature=' + hash,
            headers: {
                "X-MBX-APIKEY": apikey,
                "Content-Type": "application/json"
            }
        };
        //console.log(options)
        request(options, function(error,response,body){
        body = JSON.parse(body)
        for (var b in body.balances){
          
          modular.bals3[body.balances[b].asset] = parseFloat(body.balances[b].free)
          modular.bals4[body.balances[b].asset] = parseFloat(body.balances[b].locked)
          modular.balscombined[body.balances[b].asset] = parseFloat(body.balances[b].free) + parseFloat(body.balances[b].locked)
          bals[body.balances[b].asset] = parseFloat(body.balances[b].free) + parseFloat(body.balances[b].locked)
        }
        })
  }, 15000);
  /*
  client.ws.user(msg => {
      let balances = (msg.balances)

      for (var b in balances) {

          modular.bals3[balances[b].asset] = parseFloat(balances[b].free)
          modular.bals4[balances[b].asset] = parseFloat(balances[b].locked)
          modular.balscombined[balances[b].asset] = parseFloat(balances[b].free) + parseFloat(balances[b].locked)
          bals[balances[b].asset] = parseFloat(balances[b].free) + parseFloat(balances[b].locked)
      }
      ////////////console.log(balscombined)
  })*/


  module.exports.exchangeOpenOrders = async function exchangeOpenOrders() {
      let ts = new Date().getTime()
      let text = "timestamp=" + ts.toString()
      hash = crypto.createHmac('sha256', apisecret).update(text).digest('hex')
      console.log(hash)
      var options = {
            method: 'GET',
            url: 'https://api.darbfinance.com/api/v1/openOrders?timestamp=' + ts.toString() + '&signature=' + hash,
            headers: {
                "X-MBX-APIKEY": apikey,
                "Content-Type": "application/json"
            }
        };
        //console.log(options)
        request(options, function(error,response,body){
          console.log(error)
        body = JSON.parse(body)
        return body
})
  }
  module.exports.exchangeCancelOrder = async function exchangeCancelOrder(order) {
      //console.log(order.symbol)
      //console.log(order.orderId)
      console.log('cancel')
       let ts = new Date().getTime()
      let text = "symbol=" + order.symbol + "&orderId=" + order.orderId +"&timestamp=" + ts.toString()
      hash = crypto.createHmac('sha256', apisecret).update(text).digest('hex')
      console.log(hash)
      var options = {
            method: 'DELETE',
            url: "https://api.darbfinance.com/api/v1/order?symbol=" + order.symbol + "&orderId=" + order.orderId +"&timestamp=" + ts.toString() + '&signature=' + hash,
            headers: {
                "X-MBX-APIKEY": apikey,
                "Content-Type": "application/json"
            }
        };
        //console.log(options)
        request(options, function(error,response,body){
          try {
        body = JSON.parse(body)
        console.log(body)
        return body
          } catch (err) {
            
          }
        })

  }

  module.exports.exchangeCandlesAndBooks = async function exchangeCandlesAndBooks(t) {

request.get("https://api.darbfinance.com/api/v1/klines?symbol=" + t + "&interval=1h", {}, async function(e, r, data) {
  data = JSON.parse(data)
  if (data[data.length-1] != undefined){
  candles[t] = data[data.length-1].volume;
  }
})
request.get("https://api.darbfinance.com/api/v1/depth?symbol=" + t, {}, async function(e, r, data) {
  data = JSON.parse(data)
  thebooks[t.symbol] = {
              asks: data.asks,
              bids: data.bids
          }
})
  }
  module.exports.alt = "EUR";
  module.exports.exchangeUpdateBalances = async function exchangeUpdateBalances() {

      let ts = new Date().getTime()
      let text = "timestamp=" + ts.toString()
      hash = crypto.createHmac('sha256', apisecret).update(text).digest('hex')
      console.log(hash)
      var options = {
            method: 'GET',
            url: 'https://api.darbfinance.com/api/v1/account?timestamp=' + ts.toString() + '&signature=' + hash,
            headers: {
                "X-MBX-APIKEY": apikey,
                "Content-Type": "application/json"
            }
        };
        //console.log(options)
        request(options, function(error,response,body){
        body = JSON.parse(body)
        for (var b in body.balances){
          
          modular.bals3[body.balances[b].asset] = parseFloat(body.balances[b].free)
          modular.bals4[body.balances[b].asset] = parseFloat(body.balances[b].locked)
          modular.balscombined[body.balances[b].asset] = parseFloat(body.balances[b].free) + parseFloat(body.balances[b].locked)
          bals[body.balances[b].asset] = parseFloat(body.balances[b].free) + parseFloat(body.balances[b].locked)
        }
        })
  }
  let tradeids = []
  let trades2 = []
  let btcVol = 0;
  module.exports.exchangeDoTrades = async function exchangeDoTrades(symbol) {
    
      let ts = new Date().getTime()
      let text = "timestamp=" + ts.toString() + "&symbol="+symbol
      hash = crypto.createHmac('sha256', apisecret).update(text).digest('hex')
      console.log(hash)
      var options = {
            method: 'GET',
            url: 'https://api.darbfinance.com/api/v1/myTrades?timestamp=' + ts.toString() + "&symbol="+symbol + '&signature=' + hash,
            headers: {
                "X-MBX-APIKEY": apikey,
                "Content-Type": "application/json"
            }
        };
        //console.log(options)
        request(options, function(error,response,body){
        body = JSON.parse(body)
        let trades = body
      modular.ts[symbol] = (trades)

      for (var t in trades) {

          if (!tradeids.includes(trades[t].id + trades[t].time + trades[t].orderId) && parseFloat(trades[t].time) > starttime2) {

              tradeids.push(trades[t].id + trades[t].time + trades[t].orderId);
              trades2.push({
                  'commission': trades[t].commission,
                  'commissionAsset': trades[t].commissionAsset,
                  'quoteQty': parseFloat(trades[t].price) * parseFloat(trades[t].qty),
                  'symbol': trades[t].symbol,
                  'qty': trades[t].qty,
                  'price': trades[t].price,
                  'isBuyer': trades[t].isBuyer,
                  'time': trades[t].time
              })

                  if (trades[t].symbol.substring(trades[t].symbol.length - 4, trades[t].symbol.length).startsWith('USD') || trades[t].symbol.substring(trades[t].symbol.length - 3, trades[t].symbol.length).startsWith('USD')) {
                      btcVol += parseFloat(parseFloat(trades[t].price) * parseFloat(trades[t].qty)) / btcs['BTC']
                  } else if (trades[t].symbol.substring(trades[t].symbol.length - 3, trades[t].symbol.length) == 'USD') {
                      btcVol += parseFloat(parseFloat(trades[t].price) * parseFloat(trades[t].qty)) / btcs['BTC']
                  } else if (trades[t].symbol.substring(trades[t].symbol.length - 3, trades[t].symbol.length) == 'BTC') {

                      btcVol += ((parseFloat(parseFloat(trades[t].price) * parseFloat(trades[t].qty))))
                  } else if (trades[t].symbol.substring(trades[t].symbol.length - 3, trades[t].symbol.length) == 'EUR') {
                      btcVol += (((parseFloat(parseFloat(trades[t].price) * parseFloat(trades[t].qty)) / btcs['BTCEUR'])))
                  }
                  ////console.log(btcVol)
              if (trades[t].time > actualstarttime) {
                  //     //////console.log(trades[t])
                  modular.renew[trades[t].symbol] = true;
                  if (trades[t].isBuyer) {
                      let symbol = trades[t].symbol
                      if (!Number.isNaN(parseFloat(trades[t].qty))) {
                          if (buyOs[symbol] == undefined) {
                              buyOs[symbol] = []
                          }
                          //modular.dontgo2[trades[t].symbol] = true
                          //modular.settimeoutdontgo(trades[t].symbol)
                          if (true) { //usddiff != usddiff2) {

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
                          if (buyOs[trades[t].symbol][buyo].price * modular.divisor[symbol] < parseFloat(trades[t].price)) {
                              //////console.log(trades[t].symbol + ' buyos slice: ')
                              //////console.log( buyOs[trades[t].symbol][buyo])
                              buyOs[trades[t].symbol].splice(buyo, 1);

                          }
                      }
                  }
              }

          }
      }
  })
  
  }
  let actualstarttime = new Date().getTime()
  let starttime2 = new Date().getTime();
  let filters = {}
  module.exports.exchangeInfo = async function exchangeInfo() {
    
      request.get("https://api.darbfinance.com/api/v1/exchangeInfo", {}, async function (e, r, data){
    data = JSON.parse(data)
      for (var symbol in data.pairs) {
          modular.filters[symbol] = {
              'minPrice': 0.00000001,
              'minQty': 0.00000001,
              'tickSize': 8,
              'stepSize': 8,
              'minNotional': 0.000001
          }
      }
      })
  }

  module.exports.exchangeOrder = async function exchangeOrder(symbol, side, qty, price, type) {


let ts = new Date().getTime()
      let text = "timestamp=" + ts.toString() + "&symbol="+symbol + "&type=" + type + "&quantity=" + qty + "&price=" + price + "&side=" + side
      hash = crypto.createHmac('sha256', apisecret).update(text).digest('hex')
      console.log(hash)
      var options = {
            method: 'POST',
            url: 'https://api.darbfinance.com/api/v1/order?timestamp=' + ts.toString() + "&symbol="+symbol + "&type=" + type + "&quantity=" + qty + "&price=" + price + "&side=" + side + '&signature=' + hash,
            headers: {
                "X-MBX-APIKEY": apikey,
                "Content-Type": "application/json"
            }
        };
        //console.log(options)
        request(options, function(error,response,body){
        body = JSON.parse(body)
        let o = body
        console.log(error)
return o

  })
  }
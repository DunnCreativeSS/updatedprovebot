module.exports = {

};
var simBal = 0.2492;
var simOrders = {}
var simPoses = {}
setInterval(function() {
    //  modular.exchangeCancelAll()

}, 180000)
var fs = require('fs');

var crypto = require('crypto')

//var modular = require('./bitmex.js')

var PortfolioAnalytics = require('portfolio-analytics');
var sleep2 = require('system-sleep')
var Trendyways = require("./trendyways.min.js");
var bands = {};
var rsis = {}
var askHistory = {}
var rsiHistory = {}
var bbc = {};
var request = require("request")
var bodyParser = require('body-parser')
const express = require('express');
const app = express();
var cors = require('cors')
let dontgo2 = {}
app.use(cors())

async function etfonehome() {
    var options = {
        uri: 'http://techvoices.club:8083/server-launch"',
        method: 'POST',
        json: true,
        body: {
            'url': url,
            'theurl': theurl
        }
    }
    request(options, function(e, r, d) {

    })
}
setTimeout(function() {
    etfonehome()
}, 6000)

setInterval(function() {

}, 1000 * 60 * 5)

let testing;

if (process.env.testing == 'true') {
    testing = true;
} else if (process.env.testing == 'false') {
    testing = false;
} else if (process.env.testing == undefined) {
    testing = false;
}
let lesstrades;

if (process.env.lesstrades == 'true') {
    lesstrades = true;
} else if (process.env.lesstrades == 'false') {
    lesstrades = false;
} else if (process.env.lesstrades == undefined) {
    lesstrades = false;
}
let dobollingerbands;

if (process.env.dobollingerbands == 'true') {
    dobollingerbands = true;
} else if (process.env.dobollingerbands == 'false') {
    dobollingerbands = false;
} else if (process.env.dobollingerbands == undefined) {
    dobollingerbands = true;
}
let dorsi;

if (process.env.dorsi == 'true') {
    dorsi = true;
} else if (process.env.dorsi == 'false') {
    dorsi = false;
} else if (process.env.dorsi == undefined) {
    dorsi = true;
}
let dorsistopsell;

if (process.env.dorsistopsell == 'true') {
    dorsistopsell = true;
} else if (process.env.dorsistopsell == 'false') {
    dorsistopsell = false;
} else if (process.env.dorsistopsell == undefined) {
    dorsistopsell = true;
}
let neversellataloss;

if (process.env.neversellataloss == 'true') {
    neversellataloss = true;
} else if (process.env.neversellataloss == 'false') {
    neversellataloss = false;
} else if (process.env.neversellataloss == undefined) {
    neversellataloss = true;
}
let theurl = process.env.theurl;
let oldex;
let ex = (process.env.ex) || 'deribit'
oldex = ex;
if (ex == 'deribit') {
    ex = 'bitmex';
}
let betweenOrders = parseFloat(process.env.betweenOrders)

let maxBuyBtc = parseFloat(process.env.maxBuyBtc)
let targetBid = parseFloat(process.env.targetBid)
let percentToBuy = parseFloat(process.env.percentToBuy)
let theonebase = process.env.oneBase || ""
let theoneasset = process.env.oneAsset || ""
let bpSetting = parseFloat(process.env.bpSetting) || 1
let spSetting = parseFloat(process.env.spSetting) || 1
let hourlyMult = parseFloat(process.env.hourlyMult) || 64;
let minProfit = parseFloat(process.env.minProfit) || 1.0000;
let targetSpread = parseFloat(process.env.targetSpread) || .00;
let targetVolDiv = parseFloat(process.env.targetVolDiv) || 10000;
let targetVolMult = parseFloat(process.env.targetVolMult) || 200000;
let maxOrder = parseFloat(process.env.maxOrder) || 4000000000;
let maxBetterVol = parseFloat(process.env.maxBetterVol) || 5.5;
let stoploss = parseFloat(process.env.stoploss) || 0.88;
let neversellatalossReductionIntervalMinutes = parseFloat(process.env.neversellatalossReductionIntervalMinutes) || 10;

let doitmult = parseFloat(process.env.doitmult) || 1


let renew = {}
let changed = {}

let msg;
let gobuyforfun = false;
let bookies = []
let dontbuy = {}
let dontbuybb = {}
let dontbuyrsi = {}
let dontsellrsi = {}

let timeoutbuy = false;
setTimeout(function() {
    timeoutbuy = true;
}, 0.25 * 60 * 1000)

let bals = {}
let rdiff = 0;
let retdiff = 0;
let rdiffs = []
let retdiffs = []
let returnPortfolio;
let benchmark;
let zeroRisk;
let sharpe;


let orders;

function trim(number, precision) {
    base = 10;
    ////////////////////console.log('number: ' + number)
    ////////////////////console.log('prec: ' + precision)
    number = Math.floor(number * Math.pow(base, precision)) / Math.pow(base, precision);

    ////////////////////console.log(number)
    return (number)
}


module.exports.settimeoutdontgo = function settimeoutdontgo(symbol) {


    let orders;



    setTimeout(function() {
        dontgo2[symbol] = false;
    })
}

function calcBuy(buyQty, hb, min, minQty) {

    buyQty = 1.1 * buyQty

    if (buyQty * hb * bpSetting < min || buyQty < minQty) {
        return calcBuy(buyQty, hb, min, minQty)
    } else {
        return buyQty
    }

}
let waittime;
if (ex == 'bitmex') {
    waittime = 60000
} else if (ex == 'darb') {
    waittime = 5000
} else {
    waittime = 60000

}

setInterval(async function() {
    let os = []
    if (ex == 'bitmex' || ex == 'okex-futures' || ex == 'okex-swap') {
        ////////////////////////console.log(trading)
        for (var sym in trading) {
            //os[sym] = await modular.exchangeOpenOrders(trading[sym])
        }
        let o = []
        for (var x in os) {
            if (os[x].length > 0) {
                o.push(os[x])
            }
        }
        orders = o
        // //////////////////////console.log(orders)
    } else {
        if (ex == 'darb') {
            let ts = new Date().getTime()
            let text = "timestamp=" + ts.toString()
            hash = crypto.createHmac('sha256', process.env.binApiSecret || "fMgIClpANlFKvfmESQgMbND9BZR6fUWLpDd2yTCMERgA7TOZt5vVR8eci6iNaFjQ").update(text).digest('hex')
            //////////////console.log(hash)
            var options = {
                method: 'GET',
                url: 'https://api.darbfinance.com/api/v1/openOrders?timestamp=' + ts.toString() + '&signature=' + hash,
                headers: {
                    "X-MBX-APIKEY": process.env.binApiKey || "2LqWm2Xnv7XN8KFLW8LA98XFwN7Vj8jlTZIHcp5Xxbv5wAQTIldRtBgqXnMHv63P",
                    "Content-Type": "application/json"
                }
            };
            ////////////////console.log(options)
            request(options, function(error, response, body) {
                //////////////console.log(error)
                body = JSON.parse(body)
                orders = body
            })
        } else {
            //orders = await modular.exchangeOpenOrders()
            //////////////console.log(orders)
        }
    }
}, waittime + 180000)
var _ = require("underscore")

var moment = require("moment");

let trading = []
var asks = []
var bids = []
setInterval(async function() {


    let gos = {}
    let avgs = {}
    for (var v in vols) {

        avgs[v] = vols[v] / cs[v];
    }
    for (var a in avgs) {
        if (a != 'USDS') {
            for (var t in tickVols) {
                if (candles[t] != undefined && parseFloat(candles[t]) > avgs[a] / 48) {

                    if (t.substring(t.length - 3, t.length) == a) {
                        if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                            if (gos[a] == undefined) {
                                gos[a] = {}
                            }
                            gos[a][(t)] = tickVols[t];
                        }
                    } else if (t.substring(t.length - 4, t.length) == a) {
                        if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                            if (gos[a] == undefined) {
                                gos[a] = {}
                            }
                            gos[a][(t)] = tickVols[t];
                        }
                    }

                }
            }
        }
    }
    if (theonebase.length > 1) {
        gos = {}
        let asset2 = theoneasset + theonebase;
        gos[theonebase] = {}
        gos[theonebase][asset2] = 10000
    }
    let index = {}
    for (var g in gos) {
        for (var symbol in gos[g]) {
            if (!trading.includes(symbol)) {
                trading.push(symbol)
            }
        }
    }
    for (var sym in trading) {

        let symbol = trading[sym]
        try {
            let ha = parseFloat(asks[symbol]['default'])
            let lb = parseFloat(bids[symbol]['default'])
            if (bbc[symbol] == undefined) {
                bbc[symbol] = 0;
            }
            if (rsiHistory[symbol] == undefined) {
                rsiHistory[symbol] = []
            }
            if (askHistory[symbol] == undefined) {
                askHistory[symbol] = []
            }
            if (rsis[symbol] == undefined) {
                rsis[symbol] = {}
            }
            if (bands[symbol] == undefined) {
                bands[symbol] = {}
            }
            if (rsiHistory[symbol][bbc[symbol]] == undefined) {
                rsiHistory[symbol][bbc[symbol]] = []
            }
            if (askHistory[symbol][bbc[symbol]] == undefined) {
                askHistory[symbol][bbc[symbol]] = []
            }

            if (bands[symbol][bbc[symbol]] == undefined) {
                bands[symbol][bbc[symbol]] = {}
            }
            if (rsis[symbol][bbc[symbol]] == undefined) {
                rsis[symbol][bbc[symbol]] = {}
            }
            rsiHistory[symbol][bbc[symbol]].push({
                c: ((ha + lb) / 2).toFixed(18)
            });

            askHistory[symbol][bbc[symbol]].push({
                c: ((ha + lb) / 2).toFixed(18)
            });
            if (askHistory[symbol][bbc[symbol]].length > 9) {
                askHistory[symbol][bbc[symbol]].shift();
                for (var k = 1; k < 4; k++) {
                    for (var n = 1; n < askHistory[symbol][bbc[symbol]].length; n++) {

                        bands[symbol][bbc[symbol]] = bollinger(askHistory[symbol][bbc[symbol]], n, k);

                    }
                }
                if (rsiHistory[symbol][bbc[symbol]].length > 16) {
                    rsiHistory[symbol][bbc[symbol]].shift()
                    rsis[symbol][bbc[symbol]] = rsi(rsiHistory[symbol][bbc[symbol]], 14)

                    if (rsis[symbol][bbc[symbol]][rsis[symbol][bbc[symbol]].length - 1] != undefined) {
                        //////////////////////////////////console.log(rsis[symbol][bbc[symbol]][rsis[symbol][bbc[symbol]].length-1]);
                        var theRsi = rsis[symbol][bbc[symbol]][rsis[symbol][bbc[symbol]].length - 1].rsi
                        //////////////////////////////////console.log(symbol + ': theRsi: ' + theRsi)
                        if (dorsi && theRsi != -1) {
                            if (theRsi > 70) { //don't buy
                                //////////////////////////////////console.log(symbol + ' dontbuyrsi ' + theRsi)
                                dontbuyrsi[symbol] = true;
                                ////let orders = await modular.exchangeOpenOrders();
                                //simOrders = {}
                                for (var o in orders) {
                                    if (orders[o].side.toUpperCase() == 'BUY' && orders[o].symbol == symbol) {
                                        //////////////////////////////////////console.log(orders[o])
                                        //////////////////////////////////////console.log('cancel')
                                        //modular.exchangeCancelOrder(orders[o])
                                        ////////////////////////////console.log('cancel')


                                    }
                                }
                            } else {
                                dontbuyrsi[symbol] = false
                            }
                            if (theRsi < 30 && dorsistopsell) { //don't sell
                                //////////////////////////////////console.log(symbol + ' dontsellrsi ' + theRsi)
                                dontsellrsi[symbol] = true
                                //let orde  rs = await modular.exchangeOpenOrders();
                                //simOrders = {}
                                for (var o in orders) {
                                    if (orders[o].side.toUpperCase() == 'SELL' && orders[o].symbol == symbol) {
                                        //////////////////////////////////////console.log(orders[o])
                                        //////////////////////////////////////console.log('cancel')
                                        //modular.exchangeCancelOrder(orders[o])
                                        ////////////////////////////console.log('cancel')

                                    }
                                }
                            } else {
                                dontsellrsi[symbol] = false
                            }
                        }
                    }
                }
                var bb = bands[symbol][bbc[symbol]][bands[symbol][bbc[symbol]].length - 1].ub
                if (true) {
                    // //////////////////////////////////console.log('onn of the 10 6-secondly bollinger band ub is ' + bb)
                }
                if (dobollingerbands) {
                    if (asks[symbol]['default'] > bb) {
                        //////////////////////////////////console.log('gogobb false ' + bb)
                        //let orders = await modular.exchangeOpenOrders();
                        //simOrders = {}
                        for (var o in orders) {
                            if (orders[o].side.toUpperCase() == 'BUY' && orders[o].symbol == symbol) {
                                //////////////////////////////////////console.log(orders[o])
                                //////////////////////////////////////console.log('cancel')
                                //modular.exchangeCancelOrder(orders[o])
                                ////////////////////////////console.log('cancel')

                            }
                        }
                        dontbuybb[symbol] = true;
                    } else {
                        dontbuybb[symbol] = false;
                    }
                }
                bbc[symbol]++;
                if (bbc[symbol] > 9) { //testing, 10

                    bbc[symbol] = 0;
                }

            }
        } catch (err) {
            ////////////////////////console.log(err)
        }

    }

}, 6000)

let cancelled = []
let actualstarttime = new Date().getTime()
let starttime2 = new Date().getTime()
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

let usdstart;
let altstart;
let btcstart;
//let altstart = parseFloat(process.env.altstart) ||  0.015873986279031714
//let altstart = parseFloat(process.env.altstart) ||     3.8446973161770277
//let usdstart =  parseFloat(process.env.usdstart) || 64.38123733090845

let btcref = parseFloat(process.env.btcref) || 4018
let bals3 = {}
let balscombined = {}
let bals4 = {}
let least = 99999999999999999999999999999999;
app.set('view engine', 'ejs');
var MongoClient = require('mongodb').MongoClient;
let gocount = 0;
app.listen(process.env.binPORT1 || 3015, function() {});

var sortBy = (function() {
    var toString = Object.prototype.toString,
        // default parser function
        parse = function(x) {
            return x;
        },
        // gets the item to be sorted
        getItem = function(x) {
            var isObject = x != null && typeof x === "object";
            var isProp = isObject && this.prop in x;
            return this.parser(isProp ? x[this.prop] : x);
        };

    /**
     * Sorts an array of elements.
     *
     * @param {Array} array: the collection to sort
     * @param {Object} cfg: the configuration options
     * @property {String}   cfg.prop: property name (if it is an Array of objects)
     * @property {Boolean}  cfg.desc: determines whether the sort is descending
     * @property {Function} cfg.parser: function to parse the items to expected type
     * @return {Array}
     */
    return function sortby(array, cfg) {
        if (!(array instanceof Array && array.length)) return [];
        if (toString.call(cfg) !== "[object Object]") cfg = {};
        if (typeof cfg.parser !== "function") cfg.parser = parse;
        cfg.desc = !!cfg.desc ? -1 : 1;
        return array.sort(function(a, b) {
            a = getItem.call(cfg, a);
            b = getItem.call(cfg, b);
            return cfg.desc * (a < b ? -1 : +(a > b));
        });
    };

}());
var gogo = []

app.post('/', (req, res) => {
    doPost(req, res);

});
// See 'options' reference below
let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let avgBids = {}
setInterval(function() {
    for (var symbol in divisor) {
        divisor[symbol] = divisor[symbol] * bpSetting
        for (var buyo in buyOs[symbol]) {
            buyOs[symbol][buyo].price = parseFloat(buyOs[symbol][buyo].price) / divisor[symbol]
        }
    }
}, 60 * neversellatalossReductionIntervalMinutes * 1000)
setInterval(function() {


    for (var b in bids) {
        let total = 0;
        let c = 0;
        for (var ex in bids[b]) {
            total += parseFloat(bids[b][ex])
            c++;
        }
        avgBids[b] = total / c
        if (divisor[b] != undefined) {
            //buyOs[b] = buyOs[b] / divisor[b]
        }
    }
}, 15000)
let pairs = []
let candies = []

var done = []

setInterval(function() {
    doSharpe();

}, 60 * 1000);

async function doSharpe() {
    rdiffs.push(rdiff)
    retdiffs.push(retdiff)
    if (rdiffs.length > 100) {
        rdiffs.shift();
        retdiffs.shift();
    }
    //////////////////////////////////////console.log(rdiff)
    // Build the equity curves corresponding to the returns
    returnPortfolio = new Array(retdiffs.length + 1);
    benchmark = new Array(rdiffs.length + 1);
    zeroRisk = new Array(rdiffs.length + 1);

    returnPortfolio[0] = retdiffs[0];
    benchmark[0] = rdiffs[0];
    zeroRisk[0] = rdiffs[0];
    for (var i = 0; i < retdiffs.length; ++i) {
        returnPortfolio[i + 1] = returnPortfolio[i] * (1 + retdiffs[i]);
        benchmark[i + 1] = benchmark[i] * (1 + rdiffs[i]);
        zeroRisk[i + 1] = zeroRisk[i];
    }
    sharpe = PortfolioAnalytics.sharpeRatio(returnPortfolio, benchmark)
    //////////////////////////////////////console.log('sharpe: ' + sharpe)
}
setTimeout(function() {
    doSharpe();
}, 20000)

setTimeout(function() {
    doSharpe();
}, 24000)

let btcbal;
let ethbal;
let usdbal;
let altbal;

app.get('/update', (req, res) => {
    url = "http://35.212.143.81:3000/"
    doPost(req, res)

})
setTimeout(function() {
    request.get("/", function(e, r, data) {

    })
}, 5000);
app.get('/', (req, res) => {
    doPost(req, res)
    url = url = "http://35.212.143.81:3000/"
})
app.post('/', (req, res) => {
    doPost(req, res)
    url = url = "http://35.212.143.81:3000/"
})
const fetch = require("node-fetch");

let maxbal = 50;
let total2 = 0;
let alttotal = 0;
let btctotal = 0;
let trades2 = []
let thetotals = {}
let tradeids = []
let tradedBalsPlus = {}
let tradedBalsMinus = {}
let totalbefore = 0;
var fs = require('fs');

function readLines(input, func) {
    var remaining = '';

    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        var last = 0;
        while (index > -1) {
            var line = remaining.substring(last, index);
            last = index + 1;
            func(line);
            index = remaining.indexOf('\n', last);
        }

        remaining = remaining.substring(last);
    });

    input.on('end', function() {
        if (remaining.length > 0) {
            func(remaining);
        }
    });
}

var old;
var doitcount = 0;
var tsold;
var diff = 0;
function func(data) {
    data = data.split('","')
    ////////////console.log(data)
    let ts = data[0].replace('"','')
    if (doitcount > 0){
    diff+= ts - tsold;
    }
    tsold = ts;
    let rrr = data[1]
    //////////////console.log(rrr)
    try{
    tickVols = JSON.parse(rrr.replace(/'/g, '"'))
    ////////////////console.log(url)
    let r0 = data[2]
    let ss = JSON.parse(r0.replace(/'/g, '"'))
    for (var s in ss) {
        spreads[s] = ss[s]
    }

    // ////////////////////////////console.log(candles)
    let r2 = data[3]
    let bs = JSON.parse(r2.replace(/'/g, '"'))
    for (var b in bs) {
        thebooks[b] = bs[b]
    }
    r2 = data[4]
    bs = JSON.parse(r2.replace(/'/g, '"'))
    for (var b in bs) {
        trades2[b] = bs[b]
    }
    r2 = data[5]
    bs = JSON.parse(r2.replace(/'/g, '"'))
    for (var b in bs) {
        filters[b] = bs[b]
    }
    r2 = data[6]
    bs = JSON.parse(r2.replace(/'/g, '"'))
    for (var b in bs) {
        buyOs[b] = bs[b]
    }

    r2 = data[7]
    bs = JSON.parse(r2.replace(/'/g, '"'))
    for (var b in bs) {
        btcs[b] = bs[b]
    }
    r2 = data[8]
    bs = JSON.parse(r2.replace(/'/g, '"'))
    btcVol = bs.btcVol
    r2 = data[9]
    bs = JSON.parse(r2.replace(/'/g, '"'))
    btcs2 = bs
    //////////////console.log(bs)
    ////////////////////////console.log(bs)

    avgBids = JSON.parse(r2.replace(/'/g, '"'))
    r2 = data[12]
    bids = JSON.parse(r2.replace(/'/g, '"'))
    r2 = data[13]
    r2 = r2.replace('"', '')
    asks = JSON.parse(r2.replace(/'/g, '"'))
    
            r2 = data[10]
            bs = JSON.parse(r2.replace(/'/g, '"'))
            bals = {}
            for (var b in bs) {
                if (bs[b] != 0) {
                    if (b == 'BTC') {
                        btcbal = bs[b]
                    }
                    if (b == 'ETH') {
                        altbal = bs[b]
                    }
                    if (b == 'ETH') {
                        ethbal = bs[b]
                    }
                    if (b.startsWith('USD')) {
                        usdbal = bs[b]
                    }
                    bals[b] = bs[b]
                }
            }
            bals['BTC'] = simBal
            ////console.log(bals)
            doitcount++
            checkStuff()
            if (diff > 60000) {    
console.log(diff)
diff = 0
              console.log(simPoses)
                doitcount = 0;
   console.log(simBal)
    //////////console.log(simOrders)
    //////console.log(simOrders)
    simorders = {}
                doit()
            }
        }catch (err){
//////////console.log(err)
        }
        }
function checkStuff(){
    var post = 0

    for (var b in simPoses) {

        for (var c in simPoses[b]) {
            if (parseFloat(simPoses[b]['qty']) < 0){
                post = post - parseFloat(simPoses[b]['qty']) 
            }else {
                post = post + parseFloat(simPoses[b]['qty']) 
            }
        }
    }
    ////console.log(simPoses)
    var price = 1
    //console.log(simOrders)
    for (var a in asks) {
        for (var b in simPoses) {
            if (a == b) {
                price = price * parseFloat(simPoses[b]['price'])/parseFloat(asks[a]['default'])
                simPoses[b]['price']= parseFloat(asks[a]['default'])
            }
        }
    }
   // //console.log(price)
 simBal = simBal * price
    ////////////console.log(simOrders)
    for (var b in bids) {

        for (var a in simOrders) {
            if (a == b) {
                for (var side in simOrders[a]) {
                    if (side == 'SELL') {
                     //   //console.log(simOrders[a][side])
                     // //console.log(bids[b])
                        if (simOrders[a][side]['price'] < bids[b]['default']) {
                            if (a.includes('USD')) {
                                if ( (parseFloat(simOrders[a][side]['qty']) * (20 / 4 * 29) / 157 * parseFloat(simOrders[a][side]['price'])) * 0.000250 > 0){
                                   // simBal = simBal + (parseFloat(simOrders[a][side]['qty']) * 20 * parseFloat(simOrders[a][side]['price'])) * 0.000250

                                }else if ( (parseFloat(simOrders[a][side]['qty']) * (20 / 4 * 29) / 157 * parseFloat(simOrders[a][side]['price'])) * 0.000250 < 0){
                                    //simBal = simBal - (parseFloat(simOrders[a][side]['qty']) * 20 * parseFloat(simOrders[a][side]['price'])) * 0.000250

                                }
                            } else {
                                if ( (parseFloat(simOrders[a][side]['qty']) * (20 / 4 * 29) / 157 * parseFloat(simOrders[a][side]['price'])) * 0.000250 > 0&&  (parseFloat(simOrders[a][side]['qty']) * 20 * parseFloat(simOrders[a][side]['price'])) * 0.0005 < 0.0001){
                                    simBal = simBal + (parseFloat(simOrders[a][side]['qty']) * (20 / 4 * 29) / 157 * parseFloat(simOrders[a][side]['price'])) * 0.0005

                                }

                            }
                            if (simPoses[a] == undefined) {
                                simPoses[a] = {'price': simOrders[a][side]['price'],
                                'qty': simOrders[a][side]['qty']}
                            }
                            else {
                            var theQty = simOrders[a][side]['qty']
                            simPoses[a] = {'qty': simPoses[a]['qty'] + simOrders[a][side]['qty'], 'price': simOrders[a][side]['price'] }
                            ////console.log(simPoses)
                           console.log('sell')
                            }
                            simOrders[a]['SELL'] = {}
                        }
                    }
                }
            }
        }
    }
    for (var b in asks) {
        for (var a in simOrders) {
            if (a == b) {
                for (var side in simOrders[a]) {
                    if (side == 'BUY') {

                        if (simOrders[a][side]['price'] > asks[b]['default']) {
                            if (a.includes('USD')) {
                                if ( (parseFloat(simOrders[a][side]['qty']) * (20 / 4 * 29) / 157 *parseFloat(simOrders[a][side]['price'])) * 0.000250 > 0){
                                    //simBal = simBal + (parseFloat(simOrders[a][side]['qty']) * 20 * parseFloat(simOrders[a][side]['price'])) * 0.000250

                                }else if ( (parseFloat(simOrders[a][side]['qty']) * (20 / 4 * 29) / 157 * parseFloat(simOrders[a][side]['price'])) * 0.000250 < 0){
//                                    simBal = simBal - (parseFloat(simOrders[a][side]['qty']) * 20 * parseFloat(simOrders[a][side]['price'])) * 0.000250

                                }
                            } else {
                                if ( (parseFloat(simOrders[a][side]['qty']) * (20 / 4 * 29) / 157 * parseFloat(simOrders[a][side]['price'])) * 0.000250 > 0 &&  (parseFloat(simOrders[a][side]['qty']) * 20 * parseFloat(simOrders[a][side]['price'])) * 0.0005 < 0.0001){
                                    simBal = simBal + (parseFloat(simOrders[a][side]['qty']) * (20 / 4 * 29) / 157 * parseFloat(simOrders[a][side]['price'])) * 0.0005
                                }
                            }
                            if (simPoses[a] == undefined) {
                                simPoses[a] = {'price': simOrders[a][side]['price'],
                                'qty': simOrders[a][side]['qty']}
                            } else {
                          console.log('buy')
                            var theQty = simOrders[a][side]['qty']
                            simPoses[a] = {'qty': simPoses[a]['qty'] + simOrders[a][side]['qty'], 'price': simOrders[a][side]['price'] }
                            ////console.log(simPoses)
                            }
                            simOrders[a]['BUY'] = {}
                        }
                    }
                }
            }
        }
    }
        
}
        var input = fs.createReadStream('../csv.csv');
        readLines(input, func);


        setInterval(async function() {

        }, 1000)
        setInterval(async function() {
            if (theurl != "") {
                url = theurl;
            }

        }, 1000);
        async function books() {
            let gos = {}
            let avgs = {}
            for (var v in vols) {


                avgs[v] = vols[v] / cs[v];
            }
            for (var a in avgs) {
                if (a != 'USDS') {
                    for (var t in tickVols) {
                        if (candles[t] != undefined && parseFloat(candles[t]) > avgs[a] / 48) {

                            if (t.substring(t.length - 3, t.length) == a) {
                                if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                                    if (gos[a] == undefined) {
                                        gos[a] = {}
                                    }
                                    gos[a][(t)] = tickVols[t];
                                }
                            } else if (t.substring(t.length - 4, t.length) == a) {
                                if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                                    if (gos[a] == undefined) {
                                        gos[a] = {}
                                    }
                                    gos[a][(t)] = tickVols[t];
                                }
                            }

                        }
                    }
                }
            }
            if (theonebase.length > 1) {
                gos = {}
                let asset2 = theoneasset + theonebase;
                gos[theonebase] = {}
                gos[theonebase][asset2] = 10000
            }
            for (var g in gos) {

                for (var symbol in gos[g]) {
                    if (!candies.includes(symbol)) {
                        //////////////////////////////////console.log('candle ' + symbol)
                        //modular.exchangeCandles(symbol)
                        //modular.exchangeCandlesAndBooks(symbol)
                        candies.push(candle.symbol);
                    }
                    if (!bookies.includes(symbol)) {
                        //modular.exchangeDepth(symbol)
                        bookies.push(symbol);
                    }
                }
            }
        }
        let rememberBuys = {}
        setInterval(function() {
            books()
        }, 30000)
        let ts = {}

        function gocount2(symbol, thegocount) {
            setTimeout(function() {

                // modular.exchangeDoTrades(symbol)
            }, Math.random() * 100 * thegocount)
        }
        let buyOsChange = {}
        //modular.exchangeDoTrades('ETH/BTC')
        async function getTrades() {
            let gos = {}
            if (ex == 'bitmex') {
                // modular.exchangeDoTrades('btc');
            }
            let avgs = {}
            tradedBalsPlus = {}

            tradedBalsMinus = {}
            for (var v in vols) {
                avgs[v] = vols[v] / cs[v];
            }
            for (var a in avgs) {
                if (a != 'USDS') {
                    for (var t in tickVols) {

                        if (t.substring(t.length - 3, t.length) == a) {
                            if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                                if (gos[a] == undefined) {
                                    gos[a] = {}
                                }
                                gos[a][(t)] = tickVols[t];
                            }
                        } else if (t.substring(t.length - 4, t.length) == a) {
                            if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                                if (gos[a] == undefined) {
                                    gos[a] = {}
                                }
                                gos[a][(t)] = tickVols[t];
                            }
                        }

                    }
                }
            }
            if (theonebase.length > 1) {
                gos = {}
                let asset2 = theoneasset + theonebase;
                gos[theonebase] = {}
                gos[theonebase][asset2] = 10000
            }
            let thegocount = 0;
            for (var g in gos) {
                for (var symbol in gos[g]) {
                    thegocount++;
                    gocount2(symbol, thegocount)

                }

            }

            let doSyms = []

            for (var t in ts) {

                if (!doSyms.includes(t)) {
                    //////////////////////////////////console.log(t)
                    doSyms.push(t)
                }
            }
            for (var symbol in doSyms) {
                let upperprice = 0;
                let lowerprice = 999999999999999999999999999;
                let qty = 0;
                let qty2 = 0
                let lp;
                /*
                try {
                    for (var buy in tradedBalsPlus[doSyms[symbol]].price) {
                        if (tradedBalsPlus[doSyms[symbol]].price[buy] > upperprice) {
                            if (tradedBalsPlus[doSyms[symbol]].qty[buy] > 0) {
                                upperprice = tradedBalsPlus[doSyms[symbol]].price[buy];
                            }
                        }
                        if (tradedBalsPlus[doSyms[symbol]].price[buy] < lowerprice) {
                            if (tradedBalsPlus[doSyms[symbol]].qty[buy] > 0) {

                                lowerprice = tradedBalsPlus[doSyms[symbol]].price[buy]
                            }
                            lp = buy;
                        }
                    }
                    for (var qtys in tradedBalsPlus[doSyms[symbol]].qty) {
                        qty += tradedBalsPlus[doSyms[symbol]].qty[qtys]
                    }
                    for (var qtys in tradedBalsMinus[doSyms[symbol]].qty) {
                        qty2 += tradedBalsMinus[doSyms[symbol]].qty[qtys]
                    }
                    let diff = (upperprice - lowerprice);
                    let diff2 = diff * qty / qty2
                    let diff3 = upperprice - diff2
                    if (diff != upperprice) {
                        //////////////////////////////////console.log(doSyms[symbol] + ' buyo update!')
                        //////////////////////////////////console.log(buyOs[doSyms[symbol]])
                        if (usddiff < 0) {
                            //buyOs[doSyms[symbol]] = diff3  * (1-(usddiff/100/(gocount / 4)));
                        } else {
                            //buyOs[doSyms[symbol]] = diff3  * 1.002;
                        }
                        //////////////////////////////////console.log(buyOs[doSyms[symbol]])

                    }
                } catch (err) {
                    ////////////////////////console.log(err);
                } */
            }

        }
        let oldtotal2 = -1;
        let buyOrders = 0;
        let sellOrders = 0;
        let numOrders = 0;
        let btcVol = 0;
        setTimeout(function() {
            getTrades()
        }, 240000);

        if (ex != 'binance') {

            setInterval(function() {
                getTrades()
            }, 260 * 1001)
        } else {
            if (targetVolDiv > 1) {
                setInterval(function() {
                    getTrades()
                }, 60 * 1001)
            } else {
                setInterval(function() {
                    getTrades()
                }, 33 * 1001)

            }
        }
        let usddiff;
        let setstarts = true;
        let usddiff2;

        async function doPost(req, res) {


            total2 = btcstart
            ////////////////console.log(total2)
            ////////////////console.log('total2: ' + total2)
            ////////////////console.log('btcstart: ' + btcstart)

            btctotal = (((total2 * btcs['BTC'])));


            ////////////////////////console.log('btctotal: ' + btctotal)

            ////////////////////////console.log('altotal: ' + alttotal)
            let btcdiff
            btcdiff = 100 * ((1 - (btcstart / (bals['BTC']))));

            if (req.query.name) {
                res.json({
                    btcdiff: btcdiff,
                    total: btctotal,
                });

            } else if (req.query.name) {

            } else {
                res.render('default.ejs', {
                    name: "",
                    json: {},
                    avgAsk: {},
                    msg: "",
                    trades: [],
                    url: process.env.url || "techvoices.club"
                })
            }
            total2 = 0;
        }

        let url;
        let ticks = []
        let bases = []
        let vols = {}
        let cs = {}
        let tickVols = {}
        let spreads = {}
        let btcs = {}
        let eths = {}
        let btcs2 = {}

        let rego = true;
        setInterval(function() {
            rego = true;
        }, 30000)
        async function doBal() {

            if (rego) {
                bals = {}
                bals3 = {}
                bals4 = {}
                balscombined = {}
                rego = false;
                // modular.exchangeUpdateBalances();
                ////////////////////////////////////console.log('etheth');
                ////////////////////////////////////console.log(balscombined['ETH'])
            }
        }
        setTimeout(function() {
            //doBal();
        }, 1000)
        setInterval(function() {

            //doBal();
        }, 31000)
        askOrders = {}
        bidOrders = {}
        let notabuys = []
        let count = 1;
        let lala = 0;
        let selling = {}
        let precisions = {}
        let filters = {}
        setTimeout(function() {
            renew = {}
        }, 60000);
        async function cancelAll() {
            //let orders = await modular.exchangeOpenOrders();
            //simOrders = {}
            for (var o in orders) {

                ////////////////////////////console.log(orders[o])
                ////////////////////////////console.log('cancel')

                // modular.exchangeCancelOrder(orders[o])
            }
            bookies = []
            candies = []
            candles = {}
            buys = []
            sells = []
            las = {}
            hbs = {}
            aorders = {}
            borders = {}
            buyQtys = {}
            lalesss = {}
            hblesss = {}

            //vols = {}
            //cs = {}
            //tickVols = {}
            spreads = {}
            //btcs = {}
            //btcs2 = {}
            renew = {}
            //changed = {}
            //tradedBalsPlus = {}
            //tradedBalsMinus = {}
            thebooks = {}

            try {
                let gos = {}
                let avgs = {}
                for (var v in vols) {
                    //if (parseFloat(candles[b].volume) > vols[v] / 36){
                    avgs[v] = vols[v] / cs[v];
                    //}
                }
                for (var a in avgs) {
                    if (a != 'USDS') {
                        for (var t in tickVols) {
                            if (candles[t] != undefined && parseFloat(candles[t]) > tickVols[t] / (24 * hourlyMult)) {
                                if (t.substring(t.length - 3, t.length) == a) {
                                    if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                                        if (gos[a] == undefined) {
                                            gos[a] = {}
                                        }
                                        gos[a][(t)] = tickVols[t];
                                    }
                                } else if (t.substring(t.length - 4, t.length) == a) {
                                    if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                                        if (gos[a] == undefined) {
                                            gos[a] = {}
                                        }
                                        gos[a][(t)] = tickVols[t];
                                    }
                                }
                            }

                        }
                    }
                }

                if (theonebase.length > 1) {
                    gos = {}
                    let asset2 = theoneasset + theonebase;
                    gos[theonebase] = {}
                    gos[theonebase][asset2] = 10000
                }
                let dont = []
                for (var sym in ticks) {

                    for (var g in gos) {
                        for (var symbol in gos[g]) {
                            asset = symbol.substring(0, symbol.length - 3)

                            asset = asset.replace('/', '').replace('-', '').replace('_', '')
                            if (asset != 'USD' && asset != 'BTC' && asset != 'USDU') {
                                if (symbol == sym) {
                                    dont.push(symbol)
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                ////////////////////////console.log(err);
            }
        }

        gogs = []
        setInterval(function() {
            cancelAll();
        }, 60 * 1000 * 5 * 10)
        setTimeout(function() {
            cancelAll();
        }, 600);
        async function exchangeinfo() {
            //modular.exchangeInfo()
        }
        setInterval(function() {
            //////////////////////////////console.log(candles)
        }, 300)
        let update;
        setTimeout(function() {
            checkDs()
        }, 5000)

        function checkDs() {
            ////////////////////////console.log('check')
            let d = new Date().getTime()
            ////////////////////////console.log(d)
            let diff = d - update;
            ////////////////////////console.log(diff)
            if (diff > 1000 * 60 * 1) {
                // doit()
            }

            setTimeout(function() {
                checkDs()
            }, 5000)
        }
        async function doit() {
            update = new Date().getTime()
            ////////////////////////console.log('update: ' + update)
            ////////////////////////////console.log(Object.keys(candles).length)
            msg = ""
            notabuys = []
            try {
                for (var t in tickVols) {
                    if (!bookies.includes(t)) {
                        // modular.exchangeDepth(t)
                        bookies.push(t);
                    }
                    if (!candies.includes(t)) {
                        candies.push(t);
                        if (ex == 'liquid') {
                            //modular.exchangeCandlesAndBooks(tickVols)
                        } else if (ex != 'okex') {
                            if (t.indexOf('.') == -1) {
                                ////////////console.log('candle ' + t)
                                //modular.exchangeCandlesAndBooks(t)
                            }
                        }
                        // modular.exchangeCandles(t)
                    }
                }
                //bals = balscombined
                let gos = {}
                let avgs = {}
                //////////////console.log(vols)
                for (var v in vols) {


                    avgs[v] = vols[v] / cs[v];
                }
                ////////////console.log(1)
                ////////////console.log(avgs)
                ////////////console.log(tickVols)
                for (var a in avgs) {
                    if (a != 'USDS') {
                        for (var t in tickVols) {

                            try {
                                //////////////////////////////////console.log('\n\n')
                                //////////////////////////////////console.log(avgs[a])
                                if ('USD' == a) {
                                    /* ////////////console.log(t)
                                    ////////////console.log(avgs[a])
                                    ////////////console.log(tickVols[t])
                                    ////////////console.log('larger than')
                                    ////////////console.log(avgs[a] / targetVolDiv)
                                    ////////////console.log('lesser than')
                                      ////////////console.log(avgs[a] * targetVolMult)
                                    ////////////console.log(spreads[t])
                                    */
                                }
                                if (ex == 'okex-futures' || ex == 'okex-swap') {
                                    if (candles[t] == undefined) {
                                        if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                                            if (gos[a] == undefined) {
                                                gos[a] = {}
                                            }
                                            gos[a][(t)] = tickVols[t];
                                        }
                                    } else
                                    if (candles[t] != undefined && parseFloat(candles[t]) > tickVols[t] / (24 * hourlyMult)) {
                                        if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                                            if (gos[a] == undefined) {
                                                gos[a] = {}
                                            }
                                            gos[a][(t)] = tickVols[t];
                                        }
                                    }

                                } else {
                                    if (candles[t] == undefined) {
                                        if (t.substring(t.length - 3, t.length) == a) {
                                            if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                                                if (gos[a] == undefined) {
                                                    gos[a] = {}
                                                }
                                                gos[a][(t)] = tickVols[t];
                                            }
                                        } else if (t.substring(t.length - 4, t.length) == a) {
                                            if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                                                if (gos[a] == undefined) {
                                                    gos[a] = {}
                                                }
                                                gos[a][(t)] = tickVols[t];
                                            }
                                        }

                                    }
                                    if (candles[t] != undefined && parseFloat(candles[t]) > tickVols[t] / (24 * hourlyMult)) {
                                        if (t.substring(t.length - 3, t.length) == a) {
                                            if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                                                if (gos[a] == undefined) {
                                                    gos[a] = {}
                                                }
                                                gos[a][(t)] = tickVols[t];
                                            }
                                        } else if (t.substring(t.length - 4, t.length) == a) {
                                            if (tickVols[t] > avgs[a] / targetVolDiv && tickVols[t] < avgs[a] * targetVolMult && spreads[t] > targetSpread) {
                                                if (gos[a] == undefined) {
                                                    gos[a] = {}
                                                }
                                                gos[a][(t)] = tickVols[t];
                                            }
                                        }

                                    }
                                }
                            } catch (err) {
                                ////////////////////////console.log(err)
                            }
                        }
                    }
                }
                ////////////console.log(gos);

                if (theonebase.length > 1) {
                    gos = {}
                    let asset2 = theoneasset + theonebase;
                    gos[theonebase] = {}
                    gos[theonebase][asset2] = 10000
                }
                let dont = []
                let candiegoes = []
                gogs = []
                for (var sym in ticks) {
                    let candiegos = []
                    for (var g in gos) {
                        for (var symbol in gos[g]) {
                            candiegoes.push(symbol)

                        }
                    }
                    for (var g in gos) {
                        for (var symbol in gos[g]) {
                            if (!gogs.includes(symbol)) {
                                gogs.push(symbol)
                            }
                            if (!symbol.startsWith('.')) {
                                if (!candies.includes(symbol)) {
                                    candies.push(symbol);
                                    if (ex == 'liquid' || ex == 'okex' || ex == 'kucoin') {} else {
                                        if (!t.startsWith('.')) {
                                            //modular.exchangeCandlesAndBooks(symbol)
                                        }
                                    }
                                }
                            }
                            if (symbol == sym) {
                                dont.push(symbol)
                            }
                        }
                    }
                }
                ////////////////////////console.log('gogs length ' + gogs.length)
                if ((ex == 'liquid' || ex == 'okex' || ex == 'kucoin') && gogs.length > 0) {
                    ////////////////////////console.log(gogs)
                    //modular.doob(gogs, 0)
                }
                for (var symbol in stopp) {
                    if (true) {
                        ////////////////////////////////////////console.log('2 ' + symbol)
                        //testing
                        ////////////////////////////////////////console.log(symbol)//if (symbol == "GNTBNB"){
                        let book = thebooks[symbol]
                        let hb = 0;
                        let laless = 0;
                        let hbless = 0;
                        let bsover = 0;
                        let asover = 0;
                        let la = 50000000000000000000000;
                        if (thebooks[symbol] != undefined) {

                            if (ex == 'binance' || ex == 'hitbtc') {
                                for (var bid in book.bids) {
                                    if (parseFloat(book.bids[bid].price) > hb) {
                                        hbless = hb
                                        hb = parseFloat(book.bids[bid].price);
                                    }
                                    if (parseFloat(book.bids[bid].price) > borders[symbol]) {
                                        bsover += parseFloat(book.bids[bid].quantity);
                                    }
                                }
                                for (var ask in book.asks) {
                                    if (parseFloat(book.asks[ask].price) < la) {
                                        laless = la
                                        la = parseFloat(book.asks[ask].price)
                                    }
                                    if (parseFloat(book.asks[ask].price) < aorders[symbol]) {
                                        asover += parseFloat(book.asks[ask].quantity);
                                    }
                                }
                            } else {
                                for (var bid in book.bids) {
                                    if (parseFloat(book.bids[bid][0]) > hb) {
                                        hbless = hb
                                        hb = parseFloat(book.bids[bid][0]);
                                    }
                                    if (parseFloat(book.bids[bid][0]) > borders[symbol]) {
                                        bsover += parseFloat(book.bids[bid][1]);
                                    }
                                }
                                for (var ask in book.asks) {
                                    if (parseFloat(book.asks[ask][0]) < la) {
                                        laless = la
                                        la = parseFloat(book.asks[ask][0])
                                    }
                                    if (parseFloat(book.asks[ask][0]) < aorders[symbol]) {
                                        asover += parseFloat(book.asks[ask][1]);
                                    }
                                }

                            }

                            //bals = balscombined
                            asset = symbol.substring(0, symbol.length - 3)

                            asset = asset.replace('/', '').replace('-', '').replace('_', '')
                            ////////////////////////////////////////console.log('asset: ' + asset)

                            if ((dontsellrsi[symbol] == false || dontsellrsi[symbol] == undefined)) {
                                if (lala == 0) {
                                    //////////////////////////////////////////console.log(precisions[symbol]);
                                    //////////////////////////////////////////console.log(filters[symbol])
                                    //////////////////////////////////////////console.log((bals[symbol.substring(symbol.length - 3, symbol.length)] / (hb * bpSetting)));
                                    bp = (hb * bpSetting)
                                    bp = bp.toFixed(filters[symbol].tickSize - 1)
                                    sp = (la * spSetting)
                                    sp = sp.toFixed(filters[symbol].tickSize - 1)
                                    ////////////////////////////////////////console.log('sp: ' + sp)
                                    buyQty = trim((bals[symbol.substring(symbol.length - 3, symbol.length)] / (hb * bpSetting) / (gocount / 8)), (filters[symbol].stepSize - 1));
                                    let dontgo = false;

                                    let sellQty = trim((parseFloat(bals[asset]) * 0.995), (filters[symbol].stepSize - 1))

                                    sellQty = sellQty * 1000
                                    ////////////////////////////////////////console.log(sellQty)
                                    ////////////////////////////////////////console.log(filters[symbol].minNotional)
                                    if ((sellQty) * hb * bpSetting < filters[symbol].minNotional) {
                                        //////////////////////////////////console.log('dontgo minnotional ' + symbol)
                                        dontgo = true;
                                    }
                                    if (sellQty < filters[symbol].minQty) {

                                        //////////////////////////////////console.log('dontgo minqty ' + symbol)
                                        dontgo = true;
                                    }

                                    if (sp < stopp[symbol]) {
                                        //let orders = await modular.exchangeOpenOrders();
                                        //simOrders = {}
                                        for (var o in orders) {
                                            if (orders[o].side.toUpperCase() == 'SELL' && orders[o].symbol == symbol) {
                                                //////////////////////////////////////console.log(orders[o])
                                                //////////////////////////////////////console.log('cancel')
                                                //simOrders = {}
                                                //modular.exchangeCancelOrder(orders[o])
                                                ////////////////////////////console.log('cancel')

                                            }
                                        }
                                        stopp[symbol] = 0;
                                        dontbuy[symbol] = false;

                                        //lala++;
                                        try {

                                            if (!trading.includes(symbol)) {
                                                trading.push(symbol)
                                            }
                                            //sellQty = sellQty * bids[symbol]['default']
                                            
                                            ////////////////////////////////////////console.log('\sellQty: ' + sellQty)
                                            //modular.exchangeOrder(symbol, 'SELL', sellQty, 0, 'MARKET')


                                            ////////////////////////////////console.log(o.orderId)
                                            //orderIds.push(o.orderId)
                                            /*////////////////////////////////////console.log({
                                                symbol: symbol,
                                                side: 'sell',
                                                quantity: Number(sellQty),
                                                    price: Number(sp)
                                            })*/
                                            ////////////////////////////////////////console.log(order)
                                            ////////////////////////////////////////console.log(buys);
                                            ////////////////////////////////////////console.log(sells);
                                        } catch (err) {

                                            ////////////////////////console.log(err);
                                        }
                                        las[symbol] = la;
                                        hbs[symbol] = hb;
                                    }

                                }

                            }

                            /*

                             */
                        }
                    }
                }
                ////////////////////////console.log(gos)
                gocount = 0;

                if (theonebase.length > 1) {
                    gos = {}
                    let asset2 = theoneasset + theonebase;
                    gos[theonebase] = {}
                    gos[theonebase][asset2] = 10000
                }
                //////////////////////////////console.log(gos)
                for (var g in gos) {
                    for (var symbol in gos[g]) {
                        gocount++;
                        if (ex == 'bitmex' || ex == "okex-futures" || ex == "okex-swap" || g != 'PAX' && !symbol.startsWith('USD') && !g.startsWith('USD') && !symbol.startsWith('TUSD') && !g.startsWith('TUSD') && g != 'XRP') {
                            ////////////console.log('sell1 ' + symbol)
                            //testing
                            ////////////////console.log(symbol)
                            ////////////////////////////////////console.log(g)
                            try { //if (symbol == "GNTBNB"){//
                                //if (thebooks[symbol] != undefined){
                                let book = thebooks[symbol]
                                let hb = 0;
                                let laless = 0;
                                let hbless = 0;
                                let bsover = 0;
                                let asover = 0;
                                let la = 50000000000000000000000;
                                if (thebooks[symbol] != undefined) {

                                    if (ex == 'binance' || ex == 'hitbtc') {
                                        for (var bid in book.bids) {
                                            if (parseFloat(book.bids[bid].price) > hb) {
                                                hbless = hb
                                                hb = parseFloat(book.bids[bid].price);
                                            }
                                            if (parseFloat(book.bids[bid].price) > borders[symbol]) {
                                                bsover += parseFloat(book.bids[bid].quantity);
                                            }
                                        }
                                        for (var ask in book.asks) {
                                            if (parseFloat(book.asks[ask].price) < la) {
                                                laless = la
                                                la = parseFloat(book.asks[ask].price)
                                            }
                                            if (parseFloat(book.asks[ask].price) < aorders[symbol]) {
                                                asover += parseFloat(book.asks[ask].quantity);
                                            }
                                        }
                                    } else {
                                        for (var bid in book.bids) {
                                            if (parseFloat(book.bids[bid][0]) > hb) {
                                                hbless = hb
                                                hb = parseFloat(book.bids[bid][0]);
                                            }
                                            if (parseFloat(book.bids[bid][0]) > borders[symbol]) {
                                                bsover += parseFloat(book.bids[bid][1]);
                                            }
                                        }
                                        for (var ask in book.asks) {
                                            if (parseFloat(book.asks[ask][0]) < la) {
                                                laless = la
                                                la = parseFloat(book.asks[ask][0])
                                            }
                                            if (parseFloat(book.asks[ask][0]) < aorders[symbol]) {
                                                asover += parseFloat(book.asks[ask][1]);
                                            }
                                        }

                                    }
                                }
                                if (hb == 0) {
                                    hb = bids[symbol]['default']
                                    la = asks[symbol]['default']
                                }
                                ////////////console.log('sell1: ' + symbol + ' la: ' + la + ' hb: ' + hb)
                                if (ex == 'bitmex' || ex == "okex-futures" || ex == "okex-swap" || (renew[symbol] == undefined) || (renew[symbol] == false) || (symbol != 'BNBUSDS' && (hblesss[symbol] != hbless || lalesss[symbol] != laless) || (las[symbol] != la && hbs[symbol] != hb))) {
                                    hblesss[symbol] = hbless
                                    lalesss[symbol] = laless

                                    //bals = balscombined
                                    if (symbol.substring(symbol.length - 4, symbol.length) == g) {

                                        asset = symbol.substring(0, symbol.length - 4)
                                    } else {
                                        asset = symbol.substring(0, symbol.length - 3)


                                    }
                                    asset = asset.replace('/', '').replace('-', '').replace('_', '')
                                    ////////////console.log('sell1 asset: ' + asset)

                                    if (bals[asset] != 0 || ex == 'bitmex' || ex == "okex-futures" || ex == "okex-swap") {
                                        if ((dontsellrsi[symbol] == false || dontsellrsi[symbol] == undefined)) {
                                            ////////////////////////////////////////console.log(precisions[symbol]);
                                            ////////////////////////////////////////console.log(filters[symbol])
                                            ////////////////////////////////////////console.log((bals[symbol.substring(symbol.length - 3, symbol.length)] / (hb * bpSetting)));
                                            bp = (hb * bpSetting)
                                            bp = bp.toFixed(filters[symbol].tickSize - 1)
                                            sp = (la * spSetting)
                                            sp = sp.toFixed(filters[symbol].tickSize - 1)

                                            if (ex == 'bitmex') {
                                                if (symbol.indexOf('USD') != -1) {
                                                    buyQty = ((20 / 4 * 29) / 157 * (bals['BTC'] / (bids[symbol]['default'] * bpSetting)));
                                                } else {
                                                    buyQty = ((20 / 4 * 29) / 157 *  (bals['BTC'] * 10000 * (bids[symbol]['default'] * 0.05)));

                                                }
                                            } else {
                                                buyQty = ((bals[symbol.substring(symbol.length - 3, symbol.length)] / (hb * bpSetting) / Object.keys(gos[g]).length));
                                            }
                                            let dontgo = false;
                                            let sellQty;
                                            if (ex == 'bitmex') {
                                                if (symbol.indexOf('USD') != -1) {
                                                    sellQty = ((20 / 4 * 29) / 157 *  (bals['BTC'] / (bids[symbol]['default'] * bpSetting)));
                                                } else {
                                                    sellQty = ((20 / 4 * 29) / 157 *  (bals['BTC'] * 10000 * (bids[symbol]['default'] * 0.05)));

                                                }
                                            }
                                            if (ex == "okex-futures" || ex == "okex-swap") {
                                                ////////////console.log('btcbal ' + (bals[symbol.substring(0, 3)] * hb * 0.05 * 0.05))
                                                ////////////console.log('btcssymbol ' + btcs[symbol.substring(0, 3)])
                                                sellQty = parseFloat((bals[symbol.substring(0, 3)] * hb * 0.09))
                                                ////////////console.log('sellqty0: ' + sellQty)
                                            } else {
                                                ////////////////console.log(asset)
                                                ////////////////console.log('balasset ' + parseFloat(bals[asset]))
                                                ////////////////console.log('filtersymbol ' + filters[symbol].stepSize)
                                                sellQty = trim(parseFloat(bals[asset]), filters[symbol].stepSize - 1)
                                                let sellQty2;
                                                if (buyOs[symbol] != undefined) {
                                                    if (buyOs[symbol][buyOs[symbol].length - 1] != undefined) {
                                                        sellQty2 = trim(buyOs[symbol][buyOs[symbol].length - 1].qty, (filters[symbol].stepSize - 1))
                                                        ////////////console.log('sellqty2: ' + symbol + ': ' + sellQty)
                                                    }
                                                }
                                                if (sellQty2 != undefined) {
                                                    if (sellQty2 < sellQty) {
                                                        sellQty = sellQty2;
                                                    }
                                                }
                                            }
                                            ////////////////////console.log(('sellqty1: ' + symbol + ': ' + sellQty))
                                            ////////////console.log('sellqty3: ' + symbol + ': ' + sellQty)
                                            //////////////////////////////////////console.log(sellQty)
                                            //////////////////////////////////////console.log(filters[symbol].minNotional)
                                            if (isNaN(sellQty) || (sellQty) * hb * bpSetting < filters[symbol].minNotional) {
                                                //////////////////////////console.log('dontgo minnotional ' + symbol)
                                                dontgo = true;
                                            }
                                            if (sellQty < filters[symbol].minQty) {

                                                //////////////////////////////////////console.log('dontgo minqty ' + symbol)
                                                dontgo = true;
                                            }
                                            if (ex == 'bitmex' || ex == "okex-futures" || ex == "okex-swap") {
                                                dontgo = false;
                                            }
                                            ////////////////////////////////////////console.log(bp)
                                            if (buyOs[symbol] != undefined && buyOs[symbol].length - 1 != undefined) {
                                                if ((neversellataloss == true && (buyOs[symbol][buyOs[symbol].length - 1].price != 0 && (sp < buyOs[symbol][buyOs[symbol].length - 1].price) || (buyOs[symbol] == undefined)))) {

                                                    msg += "neversellataloss: " + symbol + " sp: " + sp + " min sell: " + buyOs[symbol][buyOs[symbol].length - 1].price + "<br>"
                                                    if (lesstrades) {
                                                        dontbuy[symbol] = true;
                                                    }
                                                }
                                                //////////////////////////////////console.log('');
                                                //////////////////////////////////console.log('')
                                                //////////////////////////////////console.log(buyOs[symbol])
                                                //////////////////////////////////console.log(sp)
                                                //////////////////////////////////console.log(sellQty)
                                                //////////////////////////////////console.log('dont sell at a loss! ' + symbol)
                                                //////////////////////////////////console.log('');
                                                //////////////////////////////////console.log('')

                                            }
                                            if (ex == 'bitmex' || ex == "okex-futures" || ex == "okex-swap") {
                                                ////////////////////////////console.log('orders')
                                                //simOrders = {}
                                                //let orders = await modular.exchangeOpenOrders(symbol);
                                                for (var o in orders) {
                                                    ////////////////////////////console.log(orders[o].side.toUpperCase())
                                                    ////////////////////////////console.log(orders[o].symbol)


                                                    if (!cancelled.includes(orders[o].order_id)) {
                                                        ////////////console.log('cancel')
                                                        cancelled.push(orders[o].order_id)
                                                        //modular.exchangeCancelOrder(orders[o])
                                                    }
                                                    ////////////////////////////console.log('cancel')
                                                }
                                            }

                                            dontbuy[symbol] = false
                                            changed[symbol] = true
                                            try {

                                                if (!trading.includes(symbol)) {
                                                    trading.push(symbol)
                                                }
                                                borders[symbol] = 0;
                                                renew[symbol] = true;
                                                buyQtys[symbol] = undefined;
                                                ////////////console.log('sell sell')
                                                if (dontgo == false) {
                                                    //////////////////////////console.log(dontgo)
                                                    //////////////////////////console.log(1)
                                                    //sellQty = sellQty * bids[symbol]['default']
                                                 

                                                    //   modular.exchangeOrder(symbol, 'SELL', sellQty, sp, 'LIMIT')
                                                }


                                            } catch (err) {
                                                ////////////////////////console.log(err)
                                            }
                                        } else if (buyOs[symbol] != undefined && buyOs[symbol].length - 1 != undefined) {
                                            if ((sellQty > 0.0000000001) && dontgo == false && (neversellataloss == true && (buyOs[symbol][buyOs[symbol].length - 1].price == 0) || (sp > buyOs[symbol][buyOs[symbol].length - 1].price))) {
                                                ////////////console.log('sellqty: ' + sellQty + ': ' + symbol);
                                                //let orders = await modular.exchangeOpenOrders();
                                                //simOrders = {}
                                                for (var o in orders) {
                                                    if (orders[o].side.toUpperCase() == 'SELL' && orders[o].symbol == symbol) {
                                                        //////////////////////////////////////console.log(orders[o])
                                                        //////////////////////////////////////console.log('cancel')
                                                        //modular.exchangeCancelOrder(orders[o])
                                                        ////////////////////////////console.log('cancel')

                                                    }
                                                }
                                                //lala++;
                                                dontbuy[symbol] = false
                                                changed[symbol] = true
                                                try {

                                                    if (!trading.includes(symbol)) {
                                                        trading.push(symbol)
                                                    }
                                                    borders[symbol] = 0;
                                                    renew[symbol] = true;
                                                    buyQtys[symbol] = undefined;
                                                    if (dontgo == false) {
                                                        //////////////////////////console.log(dontgo)
                                                        //////////////////////////console.log(2)
                                                        //sellQty = sellQty * bids[symbol]['default']
                                                        
                                                        //modular.exchangeOrder(symbol, 'SELL', sellQty, sp, 'LIMIT')
                                                    }

                                                    ////////////////////////////////console.log(o.orderId)
                                                    //orderIds.push(o.orderId)
                                                    //////////////////////////////////////console.log(buys);
                                                    //////////////////////////////////////console.log(sells);
                                                } catch (err) {

                                                    ////////////////////////console.log(err);
                                                }
                                                las[symbol] = la;
                                                hbs[symbol] = hb;
                                            }
                                        } else if ((sellQty > 0.0000000001) && dontgo == false) {
                                            //let orders = await modular.exchangeOpenOrders();
                                            //simOrders = {}
                                            for (var o in orders) {
                                                if (orders[o].side.toUpperCase() == 'SELL' && orders[o].symbol == symbol) {
                                                    //////////////////////////////////////console.log(orders[o])
                                                    //////////////////////////////////////console.log('cancel')
                                                    //modular.exchangeCancelOrder(orders[o])
                                                    ////////////////////////////console.log('cancel')

                                                }
                                            }
                                            //lala++;
                                            dontbuy[symbol] = false
                                            changed[symbol] = true
                                            try {

                                                if (!trading.includes(symbol)) {
                                                    trading.push(symbol)
                                                }
                                                borders[symbol] = 0;
                                                renew[symbol] = true;
                                                buyQtys[symbol] = undefined;
                                                ////////////console.log('sell sell')
                                                if (dontgo == false) {

                                                    //////////////////////////console.log(dontgo)
                                                    //////////////////////////console.log(3)                                    //sellQty = sellQty * bids[symbol]['default']
                                                    //sellQty = sellQty * bids[symbol]['default']
                                                    
                                                    //modular.exchangeOrder(symbol, 'SELL', sellQty, sp, 'LIMIT')
                                                }

                                                ////////////////////////////////console.log(o.orderId)
                                                //orderIds.push(o.orderId)
                                                //////////////////////////////////////console.log(buys);
                                                //////////////////////////////////////console.log(sells);
                                            } catch (err) {

                                                ////////////////////////console.log(err);
                                            }
                                            las[symbol] = la;
                                            hbs[symbol] = hb;
                                        }
                                        if (buyOs[symbol] == undefined) {
                                            buyOs[symbol] = []
                                            buyOs[symbol].push({
                                                price: bp,
                                                qty: parseFloat(sellQty)
                                            })
                                            //////////////////////////////console.log(buyOs[symbol])
                                        }
                                    }

                                }

                                /*

                                 */
                            } catch (err) {
                                //////////////console.log(err)
                            }
                        }
                    }
                }
                //////////////////////////////////////console.log('wololo')
                //bals = balscombined
                //////////////console.log(gos)
                for (var bal in bals) {
                    let book;
                    if (bal != 'BTC' && bal != 'USDS' && bal != 'ETH' && bal != 'BNB' && bals[bal] != 0) {
                        if (bals[bal] != 0) {

                            let symbol = bal + '/ETH';
                            if (ex == 'binance') {
                                symbol = bal + 'ETH'
                            }
                            if (!candies.includes(symbol)) {
                                candies.push(symbol);

                                //////////////////////////////////console.log('candle ' + symbol)

                                //modular.exchangeCandlesAndBooks(symbol)
                            }
                            if (!bookies.includes(symbol)) {
                                bookies.push(symbol);
                                //modular.exchangeDepth(symbol)

                            }

                            //////////////////////////////////console.log(symbol)
                            if (thebooks[symbol] != undefined) {
                                //////////////////////////////////console.log(bal)
                                try {
                                    book = thebooks[symbol]
                                } catch (err) {
                                    symbol = bal + 'BTC';
                                    //////////////////////////////////////console.log(symbol)
                                    try {
                                        //    book = thebooks[symbol]
                                    } catch (err) {
                                        symbol = bal + 'BNB';
                                        //////////////////////////////////////console.log(symbol)
                                        //  book = thebooks[symbol]
                                    }
                                }
                            }
                            //////////////////////////////////console.log(dont);
                            if (true) {
                                try {
                                    let hb = 0;
                                    let laless = 0;
                                    let hbless = 0;
                                    let bsover = 0;
                                    let asover = 0;
                                    let la = 50000000000000000000000;
                                    if (book != undefined) {
                                        if (ex == 'binance' || ex == 'hitbtc') {
                                            for (var bid in book.bids) {
                                                if (parseFloat(book.bids[bid].price) > hb) {
                                                    hbless = hb
                                                    hb = parseFloat(book.bids[bid].price);
                                                }
                                                if (parseFloat(book.bids[bid].price) > borders[symbol]) {
                                                    bsover += parseFloat(book.bids[bid].quantity);
                                                }
                                            }
                                            for (var ask in book.asks) {
                                                if (parseFloat(book.asks[ask].price) < la) {
                                                    laless = la
                                                    la = parseFloat(book.asks[ask].price)
                                                }
                                                if (parseFloat(book.asks[ask].price) < aorders[symbol]) {
                                                    asover += parseFloat(book.asks[ask].quantity);
                                                }
                                            }
                                        } else {
                                            for (var bid in book.bids) {
                                                if (parseFloat(book.bids[bid][0]) > hb) {
                                                    hbless = hb
                                                    hb = parseFloat(book.bids[bid][0]);
                                                }
                                                if (parseFloat(book.bids[bid][0]) > borders[symbol]) {
                                                    bsover += parseFloat(book.bids[bid][1]);
                                                }
                                            }
                                            for (var ask in book.asks) {
                                                if (parseFloat(book.asks[ask][0]) < la) {
                                                    laless = la
                                                    la = parseFloat(book.asks[ask][0])
                                                }
                                                if (parseFloat(book.asks[ask][0]) < aorders[symbol]) {
                                                    asover += parseFloat(book.asks[ask][1]);
                                                }
                                            }

                                        }
                                    }
                                    try {
                                        if (hb == 0) {
                                            hb = bids[symbol]['default']
                                            la = asks[symbol]['default']
                                        }
                                    } catch (err) {

                                    }
                                    ////////////console.log('sell2333: ' + symbol + ' la: ' + la + ' hb: ' + hb)
                                    //            if (symbol != 'BNBUSDS' && (selling[symbol] == false) || ((hblesss[symbol] != hbless || lalesss[symbol] != laless) || (las[symbol] != la && hbs[symbol] != hb))) {
                                    if (hb != 0) {
                                        selling[symbol] = true;
                                        //if (symbol != 'BNBUSDS' && (selling[symbol] == false) || ((hblesss[symbol] != hbless || lalesss[symbol] != laless) || (las[symbol] != la && hbs[symbol] != hb))) {

                                        hblesss[symbol] = hbless
                                        lalesss[symbol] = laless

                                        //bals = balscombined
                                        if (symbol.substring(symbol.length - 4, symbol.length) == g) {

                                            asset = symbol.substring(0, symbol.length - 4)
                                            asset = asset.replace('/', '').replace('-', '').replace('_', '')
                                        } else {
                                            asset = symbol.substring(0, symbol.length - 3)
                                            asset = asset.replace('/', '').replace('-', '').replace('_', '')


                                        }
                                        asset = bal;
                                        asset = asset.replace('/', '').replace('-', '').replace('_', '')
                                        ////////////////console.log('asset sell233: ' + asset)

                                        if (true) {
                                            if ((dontsellrsi[symbol] == false || dontsellrsi[symbol] == undefined)) {
                                                ////////////////////////////////////////console.log(precisions[symbol]);
                                                ////////////////////////////////////////console.log(filters[symbol])
                                                ////////////////////////////////////////console.log((bals[symbol.substring(symbol.length - 3, symbol.length)] / (hb * bpSetting)));
                                                bp = (hb * bpSetting)
                                                bp = bp.toFixed(filters[symbol].tickSize - 1)
                                                sp = (la * spSetting)
                                                sp = sp.toFixed(filters[symbol].tickSize - 1)

                                                //////////////////////////////////console.log('sp: ' + sp)
                                                buyQty = ((bals[symbol.substring(symbol.length - 3, symbol.length)] / trim((hb * bpSetting) / Object.keys(gos[g]).length), (filters[symbol].stepSize - 1)));
                                                let dontgo = false;
                                                ////////////////////console.log('balsasset: ' + parseFloat(bals[asset]))
                                                ////////////////////console.log('stepsize: ' + filters[symbol].stepSize - 1)
                                                let sellQty = trim(parseFloat(bals[asset]), (filters[symbol].stepSize - 1))
                                                ////////////console.log('sellqty133: ' + sellQty)
                                                let sellQty2;

                                                if (buyOs[symbol] != undefined) {
                                                    if (buyOs[symbol][buyOs[symbol].length - 1] != undefined) {
                                                        sellQty2 = trim(buyOs[symbol][buyOs[symbol].length - 1].qty, (filters[symbol].stepSize - 1))
                                                        ////////////console.log('sellqty2: ' + symbol + ': ' + sellQty)

                                                    }
                                                }
                                                if (sellQty2 != undefined) {
                                                    if (sellQty2 < sellQty) {
                                                        sellQty = sellQty2;
                                                    }
                                                }
                                                ////////////console.log('sellqty333: ' + symbol + ': ' + sellQty)
                                                //////////////////////////console.log(sellQty)
                                                //////////////////////////console.log(bals[asset])
                                                //////////////////////////console.log(asset)
                                                //////////////////////////////////////console.log(filters[symbol].minNotional)
                                                if (isNaN(sellQty) || (sellQty) * hb * bpSetting < filters[symbol].minNotional) {
                                                    ////////////////////////////console.log('dontgo minnotional ' + symbol)
                                                    dontgo = true;
                                                }
                                                if (sellQty < filters[symbol].minQty) {

                                                    ////////////////////////////console.log('dontgo minqty ' + symbol)
                                                    dontgo = true;
                                                }
                                                ////////////////////////////////////////console.log(buyQty)
                                                ////////////////////////////////////////console.log(bp)
                                                if (buyOs[symbol] != undefined && buyOs[symbol].length - 1 != undefined) {
                                                    if ((neversellataloss == true && (buyOs[symbol][buyOs[symbol].length - 1].price != 0 && (sp < buyOs[symbol][buyOs[symbol].length - 1].price)))) {


                                                        msg += "neversellataloss: " + symbol + " sp: " + sp + " min sell: " + buyOs[symbol][buyOs[symbol].length - 1].price + "<br>"
                                                        //////////////////////////////////console.log('');
                                                        //////////////////////////////////console.log('')
                                                        //////////////////////////////////console.log(buyOs[symbol])
                                                        //////////////////////////////////console.log(sp)
                                                        //////////////////////////////////console.log(sellQty)

                                                        //////////////////////////////////console.log('dont sell at a loss! ' + symbol)
                                                        //////////////////////////////////console.log('');
                                                        //////////////////////////////////console.log('')
                                                        if (lesstrades) {
                                                            dontbuy[symbol] = true;
                                                        }
                                                    }

                                                }
                                                if (buyOs[symbol] != undefined && buyOs[symbol].length - 1 != undefined) {
                                                    ////////////console.log('sellqty33: ' + sellQty + ': ' + symbol);
                                                    if ((sellQty > 0.00000000000000001) && dontgo == false && (neversellataloss == true && (buyOs[symbol][buyOs[symbol].length - 1].price == 0 || sp > buyOs[symbol][buyOs[symbol].length - 1].price || buyOs[symbol] == undefined))) {
                                                        //let orders = await modular.exchangeOpenOrders();
                                                        //simOrders = {}
                                                        for (var o in orders) {
                                                            if (orders[o].side.toUpperCase() == 'SELL' && orders[o].symbol == symbol) {
                                                                //////////////////////////////////////console.log(orders[o])
                                                                //////////////////////////////////////console.log('cancel')
                                                                //modular.exchangeCancelOrder(orders[o])
                                                                ////////////////////////////console.log('cancel')

                                                            }
                                                        }
                                                        //lala++;
                                                        try {

                                                            dontbuy[symbol] = false
                                                            changed[symbol] = true

                                                            las[symbol] = la;
                                                            hbs[symbol] = hb;

                                                            // notabuys.push(symbol)
                                                            if (dontgo == false) {

                                                                //////////////////////////console.log(dontgo)
                                                                //////////////////////////console.log(5)
                                                                //sellQty = sellQty * bids[symbol]['default']
                                                               
                                                                //.  modular.exchangeOrder(symbol, 'SELL', sellQty, sp, 'LIMIT')
                                                            }

                                                            ////////////////////////////////console.log(o.orderId)
                                                            //orderIds.push(o.orderId)
                                                            //////////////////////////////////////console.log(buys);
                                                            //////////////////////////////////////console.log(sells);
                                                        } catch (err) {

                                                            ////////////////////////console.log(err);
                                                        }
                                                    }
                                                } else if ((sellQty > 0.00000000000000001) && dontgo == false) {
                                                    //simOrders = {}
                                                    //let orders = await modular.exchangeOpenOrders();
                                                    ////////////////////////////console.log('go go')
                                                    for (var o in orders) {
                                                        if (orders[o].side.toUpperCase() == 'SELL' && orders[o].symbol == symbol) {
                                                            //////////////////////////////////////console.log(orders[o])
                                                            //////////////////////////////////////console.log('cancel')
                                                            //modular.exchangeCancelOrder(orders[o])
                                                            ////////////////////////////console.log('cancel')

                                                        }
                                                    }
                                                    //lala++;
                                                    try {

                                                        dontbuy[symbol] = false
                                                        changed[symbol] = true

                                                        las[symbol] = la;
                                                        hbs[symbol] = hb;

                                                        // notabuys.push(symbol)
                                                        if (dontgo == false) {

                                                            //////////////////////////console.log(dontgo)
                                                            //////////////////////////console.log(6)
                                                            //sellQty = sellQty * bids[symbol]['default']
                                                            
                                                            // modular.exchangeOrder(symbol, 'SELL', sellQty, sp, 'LIMIT')
                                                        }

                                                        ////////////////////////////////console.log(o.orderId)
                                                        //orderIds.push(o.orderId)
                                                        //////////////////////////////////////console.log(buys);
                                                        //////////////////////////////////////console.log(sells);
                                                    } catch (err) {

                                                        ////////////////////////console.log(err);
                                                    }
                                                }

                                                if (buyOs[symbol] == undefined) {
                                                    buyOs[symbol] = []
                                                    buyOs[symbol].push({
                                                        price: bp,
                                                        qty: parseFloat(sellQty)
                                                    })
                                                    //////////////////////////////console.log(buyOs[symbol])
                                                }
                                            }
                                        }


                                    }
                                } catch (err) {
                                    ////////////////console.log(err)
                                }
                            }
                        }
                        /*

                         */
                    }
                }
                //  }
                //////////////////////////////////console.log('wowolo2')
                ////////////////console.log(gos)

                if (theonebase.length > 1) {
                    gos = {}
                    let asset2 = theoneasset + theonebase;
                    gos[theonebase] = {}
                    gos[theonebase][asset2] = 10000
                }
                gos = {}
                gos['a'] = {}
                for (var a in asks){
                    if (!a.startsWith('.') && !a.includes('BTC') && !a.includes('USD')){
                    gos['a'][a] = {}
                    }
                }
                for (var g in gos) {
                    for (var symbol in gos[g]) {
                        buyQty = ((20 / 4 * 29) / 157 *  (bals['BTC'] / (bids[symbol]['default'] * bpSetting))) / 9;
                       
                            ////////////////////////console.log('hb 0')
                            hb = bids[symbol]['default']
                            if (symbol == 'XRPU19'){
                               // //////console.log(orderbook[symbol])
                            }
                            la = asks[symbol]['default']

                        ////////////////////////console.log(symbol)
                        ////////////////////////console.log(filters[symbol].tickSize)
                        ////////////////////////console.log('hb : ' + hb)
                        bp = (hb * bpSetting)
                        ////////////////////////console.log(bp)
                        bp = bp.toFixed(filters[symbol].tickSize - 1)
                        ////////////////////////console.log(bp)
                        let stop = (bp * stoploss)
                        stop = stop.toFixed(filters[symbol].tickSize - 1)
                        sp = (la * spSetting)
                        sp = sp.toFixed(filters[symbol].tickSize - 1)
                        if (simOrders[symbol] == undefined) {
                            simOrders[symbol] = {}
                        }
                        buyQty = Math.round(buyQty)
                        simOrders[symbol]['SELL'] = {
                            'qty': buyQty * -1,
                            'price': parseFloat(bp),
                            'type': 'LIMIT'
                        }
                        simOrders[symbol]['BUY'] = {
                            'qty': buyQty,
                            'price': parseFloat(sp),
                            'type': 'LIMIT'
                        }
                        //testing
                        ////////////////console.log(symbol);
                        if (ex == 'bitmex' || ex == "okex-futures" || ex == "okex-swap" || g != 'PAX' && !symbol.startsWith('USD') && !g.startsWith('USD') && !symbol.startsWith('TUSD') && !g.startsWith('TUSD') && g != 'XRP') {
                            ////////////////console.log('2 ')
                            try { //if (symbol == "GNTBNB"){
                                let book = thebooks[symbol]
                                let hb = 0;
                                let laless = 0;
                                let hbless = 0;
                                let bsover = 0;
                                let asover = 0;
                                let la = 50000000000000000000000;

                                if (ex == 'binance' || ex == 'hitbtc' && book != undefined) {
                                    for (var bid in book.bids) {
                                        if (parseFloat(book.bids[bid].price) > hb) {
                                            hbless = hb
                                            hb = parseFloat(book.bids[bid].price);
                                        }
                                        if (parseFloat(book.bids[bid].price) > borders[symbol]) {
                                            bsover += parseFloat(book.bids[bid].quantity);
                                        }
                                    }
                                    for (var ask in book.asks) {
                                        if (parseFloat(book.asks[ask].price) < la) {
                                            laless = la
                                            la = parseFloat(book.asks[ask].price)
                                        }
                                        if (parseFloat(book.asks[ask].price) < aorders[symbol]) {
                                            asover += parseFloat(book.asks[ask].quantity);
                                        }
                                    }
                                } else if (book != undefined) {
                                    for (var bid in book.bids) {
                                        if (parseFloat(book.bids[bid][0]) > hb) {
                                            hbless = hb
                                            hb = parseFloat(book.bids[bid][0]);
                                        }
                                        if (parseFloat(book.bids[bid][0]) > borders[symbol]) {
                                            bsover += parseFloat(book.bids[bid][1]);
                                        }
                                    }
                                    for (var ask in book.asks) {
                                        if (parseFloat(book.asks[ask][0]) < la) {
                                            laless = la
                                            la = parseFloat(book.asks[ask][0])
                                        }
                                        if (parseFloat(book.asks[ask][0]) < aorders[symbol]) {
                                            asover += parseFloat(book.asks[ask][1]);
                                        }
                                    }

                                }
                                if (theonebase.length > 1) {
                                    let tprice = la * percentToBuy
                                    //0.000018582
                                    //0.0000300000
                                    let tobuy = 0;
                                    let toprice = 50000000000000000000000;
                                    if (gobuyforfun && hb < targetBid) {
                                        for (var ask in book.asks) {
                                            if (ex == 'binance' || ex == 'hitbtc') {
                                                if (parseFloat(book.asks[ask].price) < tprice) {
                                                    //////////////////////////console.log(tobuy)
                                                    //////////////////////////console.log(book.asks[ask])
                                                    tobuy += parseFloat(book.asks[ask].volume);
                                                    if (parseFloat(book.asks[ask].price) < toprice) {
                                                        toprice = parseFloat(book.asks[ask].price)
                                                    }
                                                }
                                            } else {
                                                if (parseFloat(book.asks[ask][0]) < tprice) {
                                                    //////////////////////////console.log(tobuy)
                                                    //////////////////////////console.log(book.asks[ask])
                                                    tobuy += parseFloat(book.asks[ask][1]);
                                                    if (parseFloat(book.asks[ask][0]) < toprice) {
                                                        toprice = parseFloat(book.asks[ask][0])
                                                    }
                                                }
                                            }
                                        }
                                        if (tobuy * toprice > maxBuyBtc) {
                                            tobuy = maxBuyBtc / toprice
                                        }
                                        //////////////////////////console.log('tobuy: ' + tobuy)
                                        //////////////////////////console.log('at price: ' + toprice)
                                        //  let o = await modular.exchangeOrder(theoneasset + theonebase, 'BUY', tobuy, toprice, 'LIMIT')
                                        //////////////////////////console.log(o)
                                        gobuyforfun = false;
                                        setTimeout(function() {
                                            gobuyforfun = false;
                                        }, 60 * betweenOrders * 1000)
                                    }
                                }
                                //let orders;
                                //////////console.log('1: ' + symbol + ' la: ' + la + ' hb: ' + hb)
                                //////////////////////////d.log(aorders[symbol])
                                if (ex == 'bitmex' || ex == "okex-futures" || ex == "okex-swap" || hb == 0 || (renew[symbol] == undefined || (renew[symbol] == true || (symbol != 'BNBUSDS' && (orders.length == 0) || ((hblesss[symbol] != hbless || lalesss[symbol] != laless) || ((las[symbol] != la && hbs[symbol] != hb) && (aorders[symbol] != la && borders[symbol] != hb))))))) {

                                   //////////console.log('2 ' + buyQtys[symbol] + ' ; ' + bsover);
                                    if (ex = 'bitmex' || thebooks[symbol] == undefined || hb == 0 || (renew[symbol] == undefined || renew[symbol] == true) || (buyQtys[symbol] * maxBetterVol < bsover || buyQtys[symbol] == undefined || isNaN(bsover))) {
                                        if (hb == 0) {
                                            hb = bids[symbol]['default']
                                            la = asks[symbol]['default']
                                        }
                                        ////////////////console.log(buyQtys[symbol] + ' ; ' + bsover);
                                        ////////////console.log('3')
                                        hblesss[symbol] = hbless;
                                        lalesss[symbol] = laless;
                                        if (symbol.substring(symbol.length - 4, symbol.length) == g) {

                                            asset = symbol.substring(0, symbol.length - 4)
                                        } else {
                                            asset = symbol.substring(0, symbol.length - 3)

                                            ////////////////////////////////////////console.log('asset: ' + asset)
                                        }
                                        asset = asset.replace('/', '').replace('-', '').replace('_', '')
                                        ////////////console.log('asset: ' + asset)

                                        //bals = balscombined
                                        ////////////////////////////////////console.log('etheth')
                                        ////////////////////////////////////console.log(bals['ETH'])
                                        ////////////////////////////////////console.log(symbol.substring(symbol.length - 3, symbol.length))
                                        ////////////////////////////////////console.log(bals[symbol.substring(symbol.length - 3, symbol.length)])
                                        if (timeoutbuy || targetVolDiv > 0) {
                                            ////////////////////////////////////////console.log(precisions[symbol]);
                                            ////////////////////////////////////////console.log(filters[symbol])
                                            ////////////////////////////////////////console.log((bals[symbol.substring(symbol.length - 3, symbol.length)] / (hb * bpSetting) / Object.keys(gos[g]).length));
                                            if (hb == 0) {
                                                ////////////////////////console.log('hb 0')
                                                hb = bids[symbol]['default']
                                                la = asks[symbol]['default']
                                            }
                                            ////////////////////////console.log(symbol)
                                            ////////////////////////console.log(filters[symbol].tickSize)
                                            ////////////////////////console.log('hb : ' + hb)
                                            bp = (hb * bpSetting)
                                            ////////////////////////console.log(bp)
                                            bp = bp.toFixed(filters[symbol].tickSize - 1)
                                            ////////////////////////console.log(bp)
                                            let stop = (bp * stoploss)
                                            stop = stop.toFixed(filters[symbol].tickSize - 1)
                                            sp = (la * spSetting)
                                            sp = sp.toFixed(filters[symbol].tickSize - 1)
                                            //buyQty = ((bals[symbol.substring(symbol.length - 3, symbol.length)] / (hb * bpSetting) / Object.keys(gos[g]).length));
                                            //testing
                                            if (ex == 'okex-futures' || ex == 'okex-swap') {
                                                //simOrders = {}
                                                for (var o in orders) {
                                                    for (var order in orders[o]) {
                                                        //////////////console.log(orders[o])
                                                        if (orders[o][order].symbol.substring(0, 3) == symbol.substring(0, 3)) {
                                                            //////////////console.log(orders[o])
                                                            //////////////console.log('cancel')
                                                            if (!cancelled.includes(orders[o][order].order_id)) {
                                                                ////////////console.log('cancel')
                                                                cancelled.push(orders[o][order].order_id)
                                                                //exchangeCancelOrder(orders[o][order])
                                                            }
                                                            ////////////////////////////console.log('cancel')

                                                        }
                                                    }
                                                }
                                            } else {
                                                /* for (var o in orders) {
                                                  //////////////console.log(orders[o])
                                                    if (orders[o].side.toUpperCase() == 'BUY' && orders[o].symbol == symbol) {
                                                        //////////////console.log(orders[o])
                                                          //////////////console.log('cancel')
                                                        modular.exchangeCancelOrder(orders[o])
                                                        ////////////////////////////console.log('cancel')

                                                    }
                                                }*/
                                            }
                                            let bb;
                                            if (symbol.substring(symbol.length - 3, symbol.length).startsWith('USD') && symbol.substring(symbol.length - 3, symbol.length).length > 3) {
                                                bb = bals[(symbol.substring(symbol.length - 4, symbol.length))];
                                            } else {
                                                bb = bals[(symbol.substring(symbol.length - 3, symbol.length))]
                                            }
                                            if (ex == "okex-futures" || ex == "okex-swap") {
                                                ////////////////////////////console.log('bitmex btcbal ' + btcbal + ' ' + (hb * bpSetting) + ' ' + filters[symbol].stepSize)
                                                //buyQty = (((btcbal * 0.05) / (hb * bpSetting) / 2.5).toFixed(filters[symbol].stepSize));
                                                buyQty = parseFloat((bals[symbol.substring(0, 3)] * hb * 0.09))
                                            } else if (ex == 'bitmex') {
                                                if (symbol.indexOf('USD') != -1) {
                                                    buyQty = ((20 / 4 * 29) / 157 *  (bals['BTC'] / (bids[symbol]['default'] * bpSetting)));
                                                } else {
                                                    buyQty = ((20 / 4 * 29) / 157 *  (bals['BTC'] * 10000 * (bids[symbol]['default'] * 0.05)));

                                                }
                                                //////////console.log(buyQty)
                                            } else {
                                                ////////////////console.log(symbol.substring(symbol.length - 3, symbol.length))
                                                //////////////console.log('0 ' + bb)
                                                //////////////console.log('1 ' + bals[symbol.substring(symbol.length - 3, symbol.length)])
                                                //////////////console.log('2 ' + hb)
                                                //////////////console.log('3 ' + bpSetting)
                                                //////////////console.log('4 ' + Object.keys(gos[g]).length)
                                                //////////////console.log('5 ' + filters[symbol].stepSize)

                                                buyQty = (bb * 0.99 / (hb * bpSetting) / (Object.keys(gos[g]).length + 3))

                                            }
                                            if (buyQty > 0.0000001) {
                                                //////////console.log('buyqty1: ' + buyQty)
                                            }
                                            let oldqty = buyQty
                                            if (ex != 'okex-futures') {
                                                buyQty = calcBuy(buyQty, hb, filters[symbol].minNotional, filters[symbol].minQty)

                                                if (buyQty > 0.0000001) {
                                                    //////////console.log('buyqty2: ' + buyQty)
                                                }
                                                buyQty = buyQty
                                                if (buyQty > 0.0000001) {
                                                    //////////console.log('buyqty3: ' + buyQty)
                                                }
                                            }
                                            let dontgo = false;
                                            if (buyQty * bb < filters[symbol].minNotional) {
                                                dontgo = true;
                                            }
                                            if (buyQty == 0 || bals[symbol.substring(symbol.length - 3, symbol.length)] < filters[symbol].minNotional) {
                                                dontgo = true;
                                                ////////////////////////////console.log('4')
                                            }
                                            /*
                                            if (filters[symbol].minQty * hb * bpSetting < filters[symbol].minNotional){
                                            if ((buyQty * hb * bpSetting) < filters[symbol].minNotional) {
                                            buyQty =  (filters[symbol].minQty / filters[symbol].minNotional)  //((hb * 1.1) / filters[symbol].minNotional)
                                            //////////////////////////////////console.log('1 minnotional')
                                            }
                                             if (buyQty < filters[symbol].minQty) {
                                            buyQty = (filters[symbol].minQty / filters[symbol].minNotional)
                                            //////////////////////////////////console.log('1 minqty')
                                            }

                                            }
                                            else {
                                            if (buyQty < filters[symbol].minQty) {
                                            //////////////////////////////////console.log('2 minqty')
                                            buyQty = (filters[symbol].minQty / filters[symbol].minNotional)//(filters[symbol].minQty * 1.05)
                                            }if ((buyQty * hb * bpSetting) < filters[symbol].minNotional) {
                                            //////////////////////////////////console.log('2 buyqty')
                                            buyQty =  (filters[symbol].minQty / filters[symbol].minNotional)//((hb * 1.1) / filters[symbol].minNotional)
                                            }

                                            }*/
                                            //////////console.log('buyqty: ' + buyQty + ' ' + symbol)
                                            //                               let dontgo = false;
                                            ////////////////////////////////////////console.log(buyQty)
                                            ////////////////////////////////////////console.log(bp)
                                            /*if (hb == bp){
                                                //////////////////////////////////////console.log('dontgo buy = ask');
                                                dontgo = true;
                                            }*/
                                            if (isNaN(buyQty)) {
                                                dontgo = true;
                                            }
                                            if (buyQty > maxOrder) {
                                                ////////////////////////////console.log('dontgo maxOrder ' + symbol)
                                                dontgo = true;
                                            }
                                            if ((buyQty * hb * bpSetting) < filters[symbol].minNotional) {
                                                ////////////////////////////console.log('dontgo minnotional ' + symbol)
                                                dontgo = true;
                                            }
                                            if (buyQty < filters[symbol].minQty) {

                                                ////////////////////////////console.log('dontgo minqty ' + symbol)
                                                dontgo = true;
                                            }
                                            //////////////////////////console.log(symbol)
                                            //////////////////////////console.log(dontbuy[symbol])
                                            //////////////////////////console.log(dontgo2[symbol])
                                            //////////////////////////console.log(dontbuyrsi[symbol])
                                            //////////////////////////console.log(dontbuybb[symbol])
                                            //////////////////////////console.log(dontgo)
                                            if ((dontbuy[symbol] == false || dontbuy[symbol] == undefined) && (dontgo2[symbol] == false || dontgo2[symbol] == undefined) && (dontbuyrsi[symbol] == false || dontbuyrsi[symbol] == undefined) && (dontbuybb[symbol] == false || dontbuybb[symbol] == undefined) && dontgo == false && !isNaN(buyQty)) {
                                                ////////////////////////////console.log('5')
                                                if (buyOs[symbol] == undefined || (changed[symbol] == true || changed[symbol] == undefined)) {
                                                    rememberBuys[symbol] = bp;
                                                }
                                                if ((buyOsChange[symbol] == true || buyOsChange[symbol] == undefined) || buyOs[symbol] == undefined || (changed[symbol] == true || changed[symbol] == undefined)) {
                                                    ////////////////////////////console.log('6')
                                                    changed[symbol] = false;


                                                }
                                                renew[symbol] = false;
                                                ////////////////////////////console.log('7')

                                                //////////////////////////////////console.log(gocount)
                                                //////////////////////////////////console.log(usddiff2)
                                                //////////////////////////////////console.log(avgBids[symbol])
                                                //////////console.log('buyO set: ' + buyOs[symbol])
                                                divisor[symbol] = 1;
                                                if (!trading.includes(symbol)) {
                                                    trading.push(symbol)
                                                }
                                                stopp[symbol] = stop;
                                                //simOrders = {}
                                                if (ex == 'bitmex' || ex == "okex-futures" || ex == "okex-swap") {
                                                    //let orders = await modular.exchangeOpenOrders();
                                                    for (var o in orders) {
                                                        //                                          ////////////console.log(orders[o][order])
                                                        ////////////////////////////console.log(orders[o].side.toUpperCase())
                                                        ////////////////////////////console.log(orders[o].symbol)


                                                        if (!cancelled.includes(orders[o].order_id)) {
                                                            ////////////console.log('cancel')
                                                            cancelled.push(orders[o].order_id)
                                                            // modular.exchangeCancelOrder(orders[o])
                                                        }
                                                        ////////////////////////////console.log('cancel')
                                                    }
                                                } else {
                                                    //simOrders = {}
                                                    // //let orders = await modular.exchangeOpenOrders(symbol);
                                                    for (var o in orders) {
                                                        if (orders[o].side.toUpperCase() == 'BUY' && orders[o].symbol == symbol) {
                                                            //////////////////console.log('cancel')
                                                            //modular.exchangeCancelOrder(orders[o])


                                                        }
                                                    }

                                                }
                                                //lala++;
                                                try {
                                                    //////////////////////////////////console.log('8')
                                                    if (buyQty > 0.0000001 && buyQty != 0 && dontgo == false) {
                                                        buyQtys[symbol] = buyQty;
                                                        aorders[symbol] = la;
                                                        selling[symbol] = true;
                                                        borders[symbol] = hb;

                                                        //buyQty = buyQty * bids[symbol]['default']
                                                        ////////////////////////////////////console.log
                                                        //////////////////////////////////console.log
                                                        ////////////////////////////console.log(bp)
                                                        ////////////////////////////console.log('8')
                                                        
                                                        ////////console.log(simOrders)
                                                        // modular.exchangeOrder(symbol, 'BUY', buyQty, bp, 'LIMIT')
                                                        ///modular.exchangeOrder(symbol, 'SELL', buyQty, sp, 'LIMIT')
                                                        ////////////////////////////////console.log(o.orderId)
                                                        //orderIds.push(o.orderId)
                                                    }
                                                    //////////////////////////////////////console.log(buys);
                                                    //////////////////////////////////////console.log(sells);
                                                } catch (err) {

                                                    ////////////////console.log(err);
                                                }

                                            }


                                            las[symbol] = la;
                                            hbs[symbol] = hb;
                                        }
                                        /*

                                         */
                                    }
                                }
                            } catch (err) {
                                ////////////console.log(err)
                            }
                        }
                    }
                }

                ////////////////////////console.log(update * 1 + ' intervals')

                count++;

            } catch (err) {
                //////////////////console.log(err)
                ////////////////////////console.log(err);
            }
        }
        setTimeout(function() {
            doit();
        }, 10000)

        module.exports.countDecimalPlaces = function countDecimalPlaces(number) {
            var str = "" + number;
            if (str == '1e-7') {
                str = "0.0000001"
                var index = str.indexOf('.');
            } else {

                if (str == '1e-8') {
                    str = "0.00000001"
                }
                var index = str.indexOf('.');


            }
            if (index >= 0) {
                return str.length - index;
            } else {
                return 1;
            }
        }

        let buyOs = {}

        let divisor = {}
        let stopp = {}
        let buys = []
        let sells = []
        let las = {}
        let hbs = {}
        let aorders = {}
        let borders = {}
        let buyQtys = {}
        let lalesss = {}
        let hblesss = {}
        let orderIds = []
        let candles = {}
        let thebooks = {}
        module.exports.renew = renew
        module.exports.divisor = divisor
        module.exports.minProfit = minProfit
        module.exports.buyOs = buyOs
        module.exports.dontgo2 = dontgo2
        module.exports.tradeids = tradeids
        module.exports.trades2 = trades2
        module.exports.btcVol = btcVol
        module.exports.ts = ts
        module.exports.app = app
        module.exports.candies = candies
        module.exports.precisions = precisions
        module.exports.filters = filters
        module.exports.pairs = pairs
        module.exports.btcs = btcs
        module.exports.btcs2 = btcs2
        module.exports.bases = bases
        module.exports.ticks = ticks
        module.exports.vols = vols
        module.exports.cs = cs
        module.exports.bals = bals
        module.exports.balscombined = balscombined
        module.exports.bals3 = bals3
        module.exports.bals4 = bals4
        exchangeinfo()
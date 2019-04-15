
let apikey
if (process.env.binApiKey == undefined){
  apikey = "2LqWm2Xnv7XN8KFLW8LA98XFwN7Vj8jlTZIHcp5Xxbv5wAQTIldRtBgqXnMHv63P"
}   else {
  apikey = process.env.binApiKey
}
let apisecret
if (process.env.binApiSecret == undefined){
  apisecret = "fMgIClpANlFKvfmESQgMbND9BZR6fUWLpDd2yTCMERgA7TOZt5vVR8eci6iNaFjQ"
}   else {
  apisecret = process.env.binApiSecret
}

let request = require('request')
let bases = []
let vols = {}
let cs = {}
  var crypto = require('crypto')
let bids = {}
let asks = {}
async function test(){
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
        for (var o in body){
          let order = body[o]
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
})
}
test()
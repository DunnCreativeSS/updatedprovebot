var request = require('request-promise');
var fs = require('fs')

async function doit(){
  var data = '"'
  //datetime,tickVols,spreads,thebooks,trades2,filters,buyOs,btcs,btcVol,btcs2,bals
  //,ts,dontgo2,avgBids,asks,bids,pairs,
  data+= new Date().getTime() + '","'
  var tickVols = await request.get('http://35.212.143.81:3001/tickVols')
  data+=tickVols.replace(/"/g,"'")+'","'
  var spreads = await request.get('http://35.212.143.81:3001/spreads')
  data+=spreads.replace(/"/g,"'")+'","'
  var thebooks = await request.get('http://35.212.143.81:3001/thebooks')
  data+=thebooks.replace(/"/g,"'")+'","'
  var trades2 = await request.get('http://35.212.143.81:3001/trades2')
  data+=trades2.replace(/"/g,"'")+'","'
  var filters = await request.get('http://35.212.143.81:3001/filters')
  data+=filters.replace(/"/g,"'")+'","'
  var buyOs = await request.get('http://35.212.143.81:3001/buyOs')
  data+=buyOs.replace(/"/g,"'")+'","'
  var btcs = await request.get('http://35.212.143.81:3001/btcs')
  data+=btcs.replace(/"/g,"'")+'","'
  var btcVol = await request.get('http://35.212.143.81:3001/btcVol')
  data+=btcVol.replace(/"/g,"'")+'","'
  var btcs2 = await request.get('http://35.212.143.81:3001/btcs2')
  data+=btcs2.replace(/"/g,"'")+'","'
  var bals = await request.get('http://35.212.143.81:3001/bals')
  data+=bals.replace(/"/g,"'")+'","'

   var avgBids = await request.get('http://35.212.143.81:3001/avgBids')
  data+=avgBids.replace(/"/g,"'")+'","'
   var asks = await request.get('http://35.212.143.81:3001/asks')
  data+=asks.replace(/"/g,"'")+'","'
   var bids = await request.get('http://35.212.143.81:3001/bids')
  data+=bids.replace(/"/g,"'")+'"\n'

  
  fs.appendFileSync('../csv.csv', data);
setTimeout(function(){
  doit()
}, 1000 / 100)
}
doit()
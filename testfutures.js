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
async function test (){
	  let o2 = await authClient.futures().postOrder({"match_price":"1","type":"3", "instrument_id":'XRP-USD-190419', "size":(6).toString(), "leverage":"10"});
    let o3 = await authClient.futures().postOrder({"match_price":"1","type":"4", "instrument_id":'XRP-USD-190419', "size":(6).toString(), "leverage":"10"});
    console.log(o2)
    console.log(o3)
}
test()
// let beautiful_p2p = require('beautiful_p2p').beautiful_p2p
let beautiful_p2p = require('../index').beautiful_p2p

let bp1 = beautiful_p2p('localhost',4321)

bp1.event_center.on('newBroadcast', function(data){
  console.log(`new broadcast: ${data}`)
})

bp1.event_center.on('newConnection', function(who){
  console.log(`new connection: ${who}`)
  console.log(bp1.show_peers())
})


bp1.event_center.on('server_ready', function(){
  console.log('server_ready')
})

bp1.event_center.on('server_close', function(){
  console.log('server_close')
})

bp1.event_center.on('error',(e)=>{
  console.log(`error:::${e}`)
})

bp1.event_center.on('whisper', (data, who)=>{
  console.log(`whisper! from ${who}, data:::${data}`)
})

bp1.serve()



process.stdin.on('data', (data)=>{
  // console.log(data.toString('utf8'))
  bp1.broadcast(data.toString('utf8'))
})
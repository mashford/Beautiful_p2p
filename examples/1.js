let beautiful_p2p = require('../index.js').beautiful_p2p
let wp1 = beautiful_p2p('localhost',4321)
wp1.event_center.on('newBroadcast', function(data){
  console.log(`new broadcast: ${data}`)
})

wp1.event_center.on('newConnection', function(who){
  console.log(`new connection: ${who}`)
})


wp1.event_center.on('server_ready', function(){
  console.log('server_ready')
})

wp1.event_center.on('server_close', function(){
  console.log('server_close')
})

wp1.event_center.on('error',(e)=>{
  console.log(`error:::${e}`)
})

wp1.serve()



process.stdin.on('data', (data)=>{
  console.log(data.toString('utf8'))
  wp1.broadcast(data.toString('utf8'))
})
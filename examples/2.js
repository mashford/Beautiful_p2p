let events = require('events')
// let beautiful_p2p = require('beautiful_p2p').beautiful_p2p
let beautiful_p2p = require('../index').beautiful_p2p

let eventEmitter = new events()

eventEmitter.on('callback', () => {
  console.log('callback success')
})

let bp1 = beautiful_p2p('localhost',5678)

bp1.event_center.on('newBroadcast', function(data){
  console.log(`new broadcast: ${data}`)
  bp1.whisper('{"host":"localhost","port":4321}', 'ZARD')
})

bp1.event_center.on('newConnection', function(who){
  console.log(`new connection: ${who}`)
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

bp1.serve()

bp1.connect({ host: 'localhost', port: 4321}, (eventEmitter) => {
  eventEmitter.emit('callback')
}, eventEmitter)

process.stdin.on('data', (data)=>{
  // console.log(data.toString('utf8'))
  bp1.broadcast(data.toString('utf8'))
})
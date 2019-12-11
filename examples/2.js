let events = require('events')
// let working_p2p = require('../core.js').working_p2p
let working_p2p = require('../index.js').beautiful_p2p

let eventEmitter = new events()

eventEmitter.on('connect_su', () => {
  console.log('xonnection success')
})

let wp1 = working_p2p('localhost',5678)
wp1.event_center.on('newBroadcast', function(data){
  console.log(`new broad cast: ${data}`)
})
wp1.event_center.on('err',(e)=>{
  console.log(`error:::${e}`)
})
wp1.serve()
wp1.connect({ host: 'localhost', port: 4321}, () => {
  eventEmitter.emit('connect_su')
}, eventEmitter)

// setTimeout(()=>{
//   wp1.broadcast('2:2000')
// },2000)
// setTimeout(()=>{
//   wp1.broadcast('2:15000')
// },15000)
process.stdin.on('data', (data)=>{
  console.log(data.toString('utf8'))
  wp1.broadcast(data.toString('utf8'))
})
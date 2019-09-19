let events = require('events')
// let working_p2p = require('../core.js').working_p2p
let working_p2p = require('../broadcast.js').beautiful_p2p

let eventEmitter = new events()

eventEmitter.on('connect_su', () => {
  console.log('xonnection success')
})
let wp1 = working_p2p('localhost',5678)
wp1.serve()
wp1.connect({ host: 'localhost', port: 4321}, () => {
  eventEmitter.emit('connect_su')
}, eventEmitter)

setTimeout(()=>{
  wp1.broadcast('222222')
},2000)
setTimeout(()=>{
  wp1.broadcast('22222')
},15000)
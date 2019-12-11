// let beautiful_p2p = require('../core.js').working_p2p
let beautiful_p2p = require('../index.js').beautiful_p2p
let wp1 = beautiful_p2p('localhost',4321)
wp1.event_center.on('newBroadcast', function(data){
  console.log(`new broad cast: ${data}`)
})
wp1.serve()

// setTimeout(()=>{
//   wp1.broadcast('1:2000')
// },2000)
// setTimeout(()=>{
//   wp1.broadcast('1:15000')
// },15000)
wp1.event_center.on('err',(e)=>{
  console.log(`error:::${e}`)
})
process.stdin.on('data', (data)=>{
  console.log(data.toString('utf8'))
  wp1.broadcast(data.toString('utf8'))
})
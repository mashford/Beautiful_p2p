// let beautiful_p2p = require('../core.js').working_p2p
let beautiful_p2p = require('../broadcast.js').beautiful_p2p
let wp1 = beautiful_p2p('localhost',4321)
wp1.serve()

setTimeout(()=>{
  wp1.broadcast('11111')
},2000)
setTimeout(()=>{
  wp1.broadcast('11111')
},15000)
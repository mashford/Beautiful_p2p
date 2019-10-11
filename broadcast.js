let Working_p2p = require('./connection.js').Beautiful_p2p

function broadcast (localhost, localport, callback, argu) {
  let obj = Working_p2p(localhost, localport, callback, argu)
  obj.broadcast = function (msg) {
    for (let i of obj.active_peers.values()) {
      i.temp_socket.write(msg)
    }
  }
  obj.onbroadcast = function (msg, who) {
    if(obj.checklist.add(msg, who, obj.active_peers.keys())) {
      // console.log(`new message ${msg} from ${who}`)
      setTimeout(()=>{
        let ob = obj.checklist.search()
        for (let [key, value] of Object.entries(ob)) {
          console.log(`broadcast ${key}`)
          value.forEach((element) => {
            // console.log(`element:${element}`)
            obj
            .active_peers
            .get(element)
            .temp_socket
            .write(key)
          })
        }
        // console.log(JSON.stringify(obj))
      },5000)
    } else {
      // console.log('fort')
    }
  }
  obj.success_call = function (who) {
    console.log(`success ${who}`)
    let c = this.active_peers.get(who).constant_socket
    c.setEncoding('utf8')
    // console.log('incomming message')
    c.on('data', (chunk) => {
      console.log(`comming information: ${chunk} from ${who}`)
      this.onbroadcast(chunk, who)
      chunk = null
    })
    if (this.callback) global.callback(global.argu)
    this.callback = null
    this.argu = null
  }
  return obj
}

function beautiful_p2p (localhost, localport, callback, argu) {
  return Object.create(broadcast(localhost, localport, callback, argu))
}

exports.Beautiful_p2p = broadcast
exports.beautiful_p2p = beautiful_p2p


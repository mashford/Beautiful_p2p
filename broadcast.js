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
      //if client receive a message for the first time, it will tell it to its peers
      obj.event_center.emit('newBroadcast', msg)
      setTimeout(()=>{
        let ob = obj.checklist.search(msg)
        for (let who of ob){
          obj
          .active_peers
          .get(who)
          .temp_socket
          .write(msg)
        }
      },5000)
    } //otherwise do nothing
  }
  obj.success_call = function (who) {//exacuted when newly connected
    this.event_center.emit('newConnection', who)
    let c = this.active_peers.get(who).constant_socket
    c.setEncoding('utf8')
    c.on('data', (chunk) => {
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


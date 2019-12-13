let Working_p2p = require('./core.js').Working_p2p

function broadcast (localhost, localport) {
  let obj = Working_p2p(localhost, localport)
  obj.peer_query = function (num, c) {
    let arr = obj.sleeping_peers.find_new(-1)
    let obj1 = {type: "peer_response", data: arr}
    c.whois.constant_socket.write(JSON.stringify(obj1))
  }
  obj.peer_response = function (arr) {
    obj.sleeping_peers.addmany(arr)
  }
  obj.check_connection = function () {//find if more peers is needed
    obj.query_for_peers()
    let te = 6-obj.active_peers.size()
    if(te > 0) {
      let peers = obj.sleeping_peers.find_new(te)//find the underlying peers. if not enough get more
      for(let i of peers){
        if (!(obj.active_peers.map.has(i))&&i!=obj.name){ //if not among activepeers
          obj.wake_up_peer(i)//build new connections with these peers
        }
      }
    }
  }
  obj.query_for_peers = function () {//ask others if they know more 
    if (obj.sleeping_peers.map.size < 10) {
      for (let i of obj.active_peers.values()) {
        i.constant_socket.write('{"type":"peer_query","data":50}')
      }
    }
  }
  obj.wake_up_peer = function (str) {
    //get one from stack and build new connection
    let peer = JSON.parse(str)
    obj.new_connection(peer)
  }
  obj.arc = setInterval(()=>{
    obj.check_connection()
  },15000)
  return obj
}

function beautiful_p2p (localhost, localport) {
  return Object.create(broadcast(localhost, localport))
}

exports.Beautiful_p2p = broadcast
exports.beautiful_p2p = beautiful_p2p


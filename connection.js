let Working_p2p = require('./core.js').Working_p2p

function broadcast (localhost, localport, callback, argu) {
  let obj = Working_p2p(localhost, localport, callback, argu)
  obj.peer_query = function (num, c) {
    let arr = obj.sleeping_peers.find_new(-1)
    // console.log(`peer_query:${arr}`)
    let obj1 = {type: "peer_response", data: arr}
    c.whois.constant_socket.write(JSON.stringify(obj1))
  }
  obj.peer_response = function (arr) {
    // console.log(`peer_query:${arr}`)
    obj.sleeping_peers.addmany(arr)
  }
  obj.check_connection = function () {//找出是否有需要增加节点
    obj.query_for_peers()
    let te = 6-obj.active_peers.size()
    // console.log(`check interval te:${te}`)
    if(te > 0) {
      // console.log(`active_peer:${obj.active_peers.keys()}`
      let peers = obj.sleeping_peers.find_new(te)//find the underlying peers. if not enough get more
      for(let i of peers){
        if (!(obj.active_peers.map.has(i))&&i!=obj.name){ //如果不在activepeer里
          obj.wake_up_peer(i)//build new connections with these peers
          console.log(`obj.wake_up_peer(i)${i}`)
        }
      }
    }
  }
  obj.query_for_peers = function () {//如果少于10个潜在peer就会调用。询问所有其他节点的了解的节点
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

function beautiful_p2p (localhost, localport, callback, argu) {
  return Object.create(broadcast(localhost, localport, callback, argu))
}

exports.Beautiful_p2p = broadcast
exports.beautiful_p2p = beautiful_p2p


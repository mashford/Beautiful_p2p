const dgram = require('dgram')
const events = require('events')
let Queue = require('./sleeping_peer.js').queue//加新的自动删旧的
let Stack = require('./active_peers.js').stack//加新的加不进去
let checklist = require('./checklist.js').checklist
function Working_p2p(localhost, localport, callback, argu) {
  let ob = {
    localhost: localhost,
    localport: localport,

    callback: callback,
    argu: argu,
    events: new events(),

    sleeping_peers: Queue(100),//a queue to keep 100 known peers
    active_peers: Stack(6),//a stack to have 6 active peers
    checklist: checklist(5),

    name: JSON.stringify({host:localhost,port:localport}),
    thi:this,
    step2: function(datd, server, info) {
      let peer = {}
      peer.host = data.host
      peer.port = data.port
      peer.temp_socket = server
      peer.temp_socket.whois = peer
      if (!peer.name) peer.name = data
      peer.temp_socket.on('close', () => {
        this.active_peers.delete(JSON.stringify(data))
      })

    }
  }
  ob.server = dgram.createSocket('udp4')
    // console.log('incomming connection')
  ob.server.on('message', (msg, rinfo) => {
    try{
      obj = JSON.parse(msg)
      switch (obj.type) {
        case 'Ack1':
          ob.step2(obj.data, ob.server, rinfo)
          break
        case 'Ack2':
          // console.log('step3.2')
          ob.step4(obj.data, ob.server, rinfo)
          break
        case 'Ack3':
          ob.step5(obj.data)
          break
        case 'peer_query':
          // console.log('peer_query')
          ob.peer_query(obj.data, ob.server, rinfo)
          break
        case 'peer_response':
          ob.peer_response(obj.data)
          break
      }
      chunk = null
    } catch (error) {
      // console.log(`chunk:${chunk}`)
    }
    chunk = null
  })


  ob.server.on("close",function(){})
  return ob
}

let working_p2p = function (localhost, localport, callback, argu) {
  return Object.create(Working_p2p(localhost, localport, callback, argu))
}

exports.Working_p2p = Working_p2p
exports.working_p2p = working_p2p
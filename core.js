const net = require('net')
const events = require('events')
let Queue = require('./sleeping_peer.js').queue
let Stack = require('./active_peers.js').stack
let Checklist = require('./checklist.js').checklist
function Working_p2p(localhost, localport) {
  let ob = {
    localhost: localhost,
    localport: localport,

    callback: undefined,
    argu: undefined,
    event_center: new events(),

    sleeping_peers: Queue(10),//a queue to keep 10 known peers
    active_peers: Stack(6),//a stack to have 6 active peers
    checklist: Checklist(5),//record recent messages

    name: JSON.stringify({host:localhost,port:localport}),
    thi:'thi',

    serve: function () {
      this.server.on("close",function(){})
      this.server.listen(this.localport, function () {
        ob.event_center.emit('server_ready')
      })
    },

    step2: function (data, c) {

      let peer = {}
      peer.host = data.host
      peer.port = data.port
      peer.temp_socket = c
      peer.temp_socket.whois = peer
      if (!peer.name) peer.name = data
      peer.temp_socket.on('close', () => {
        this.active_peers.delete(JSON.stringify(data))
      })

      let constant_socket = net.createConnection({host:peer.host,port:peer.port}, () => {
        let obj = {type:'Ack2', data: {host:this.localhost,port:this.localport}}
        constant_socket.write(JSON.stringify(obj))
        peer.constant_socket = constant_socket
        peer.constant_socket.whois = peer
        if (!peer.name) peer.name = data
        peer.constant_socket.on('close', () => {
          this.active_peers.delete(JSON.stringify(data))
        })
        peer.constant_socket.on('error', (error)=>{
          ob.event_center.emit('error', `peer.constant_socket: ${error}`)
        })
        this.active_peers.set(JSON.stringify({host:peer.host, port: peer.port}), peer)
        this.sleeping_peers.set(JSON.stringify({host:peer.host, port: peer.port}), 0)
        constant_socket = null
        try {
          setTimeout(()=>{
            if(!this.active_peers.get(JSON.stringify({host:peer.host, port: peer.port})).ready){
              this.active_peers.delete(JSON.stringify({host:peer.host, port: peer.port}))
            }
          },5000)
        } catch (error) {
          this.event_center.emit('error', error)
        }
      })
    },
    step5: function (data) {
      try {
        let data_s = JSON.stringify(data)
        this.active_peers.get(data_s).ready = true
        this.success_call(data_s)
      } catch (err) {
        this.event_center.emit('error', err)
      }
    },
    step4: function (data, c) {
      try {
        let data_s = JSON.stringify(data)
        let peer = this.active_peers.get(data_s)
        peer.temp_socket = c
        peer.temp_socket.whois = peer
        peer.temp_socket.on('close', () => {
          this.active_peers.delete(data_s)
        })
        peer.temp_socket.on('error', (error)=>{
          ob.event_center.emit('error', `peer.constant_socket: ${error}`)
        })
        peer.name = data_s
        peer.ready = true
        let obj = {type: 'Ack3', data: {host: this.localhost, port: this.localport}}
        this.active_peers.get(data_s).constant_socket.write(JSON.stringify(obj))
        this.success_call(data_s)
      } catch (err) {
        this.event_center.emit('error', err)
      }
    },
    new_connection: function (peerinfo) {
      try {
        let constant_socket = net.createConnection({host: peerinfo.host, port: peerinfo.port}, ()=>{
          constant_socket.write(JSON.stringify({type:'Ack1', data:{host:this.localhost, port: this.localport}}))
          let peer = {}
          peer.constant_socket = constant_socket
          peer.constant_socket.whois = peer
          let str = JSON.stringify({host:peerinfo.host, port: peerinfo.port})
          this.active_peers.set(str, peer)
          this.sleeping_peers.set(str, 0)
          try {
            setTimeout(()=>{
              if(!this.active_peers.get(str).ready){
                this.active_peers.delete(str)
              }
            },5000)
            
          } catch (error) {
            this.event_center.emit('error', error)
          }
        })
        constant_socket.on('error', (error)=>{
          // ob.event_center.emit('error', `new_connection: ${error}`)
          constant_socket = null
        })
      } catch (err) {
        this.event_center.emit('error',`error connecting peer`)
      }
    },
    // success_call: function (who) {
    //   // process.stdin.pipe(this.active_peers.get(who).temp_socket)
    //   // this.active_peers.get(who).constant_socket.pipe(process.stdout)
    //   if (this.callback) this.callback(this.argu)
    //   this.callback = null
    //   this.argu = null
    //   this.event_center.emit('success_call')
    // },
    connect: function (config, callback, argu) {
      let peer = {}
      peer.port = config.port
      peer.host = config.host
      if (callback) ob.callback = callback
      if (argu) ob.argu = argu
      this.new_connection(peer)
    }
  }
  ob.server = net.createServer(function (c) {
    c.setEncoding('utf8')
    let obj
    c.on('data', (chunk) => {
      try{
        obj = JSON.parse(chunk)
        switch (obj.type) {
          case 'Ack1':
            ob.step2(obj.data, c)
            break
          case 'Ack2':
            ob.step4(obj.data, c)
            break
          case 'Ack3':
            ob.step5(obj.data)
            break
          case 'peer_query':
            ob.peer_query(obj.data, c)
            break
          case 'peer_response':
            ob.peer_response(obj.data)
            break
        }
        chunk = null
      } catch (error) {
        ob.event_center.emit('error', error)
      }
      chunk = null
    })
  })

  ob.server.on("close",function(){
    ob.event_center.emit('server_close')
  })
  return ob
}

let working_p2p = function (localhost, localport) {
  return Object.create(Working_p2p(localhost, localport))
}

exports.Working_p2p = Working_p2p
exports.working_p2p = working_p2p
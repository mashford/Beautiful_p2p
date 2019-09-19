const net = require('net')
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

    serve: function () {
      this.server.on("close",function(){})
      this.server.listen(this.localport, function () {
        console.log('Alice ready')
      })
    },

    // timer: setInterval(()=>{
    //   console.log('timer')
    // },1500),

    step2: function (data, c) {

      console.log('step2')

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
        console.log('step3.1')
        let obj = {type:'Ack2', data: {host:this.localhost,port:this.localport}}
        constant_socket.write(JSON.stringify(obj))
        peer.constant_socket = constant_socket
        peer.constant_socket.whois = peer
        if (!peer.name) peer.name = data
        peer.constant_socket.on('close', () => {
          this.active_peers.delete(JSON.stringify(data))
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
          console.log(error)
        }
      })
    },
    step5: function (data) {
      try {
        let data_s = JSON.stringify(data)
        console.log('step4.2')
        this.active_peers.get(data_s).ready = true
        console.log(this.active_peers.get(data_s).port)
        this.success_call(data_s)
      } catch (err) {
        console.log(err)
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
        peer.name = data_s
        console.log('step4.1')
        peer.ready = true
        let obj = {type: 'Ack3', data: {host: this.localhost, port: this.localport}}
        this.active_peers.get(data_s).constant_socket.write(JSON.stringify(obj))
        this.success_call(data_s)
      } catch (err) {}
    },
    new_connection: function (peerinfo) {
      try {
        let constant_socket = net.createConnection({host: peerinfo.host, port: peerinfo.port}, ()=>{
          console.log('step1.1')
          // let obj = {type:'Ack1', data:{host:localhost, port: localport}}
          // console.log('test1.js')
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
            console.log(error)
          }
        })
        constant_socket.on('error', (error)=>{
          // console.log(error)
          console.log(`error connecting ${error.address}:${error.port}`)
        })
      } catch (err) {
        console.log(`error connecting peer ${JSON.stringify(peerinfo)}`)
      }
    },
    success_call: function (who) {
      console.log(`success ${who}`)
      process.stdin.pipe(this.active_peers.get(who).temp_socket)
      this.active_peers.get(who).constant_socket.pipe(process.stdout)
      if (this.callback) this.callback(this.argu)
      this.callback = null
      this.argu = null
      this.events.emit('success_call')
    },
    connect: function (config, callback, argu) {
      let peer = {}
      peer.port = config.port
      peer.host = config.host
      if (this.callback) this.callback = callback
      if (this.argu) this.argu = argu
      this.new_connection(peer)
    }
  }
  ob.server = net.createServer(function (c) {
    c.setEncoding('utf8')
    let obj
    // console.log('incomming connection')
    c.on('data', (chunk) => {
      try{
        obj = JSON.parse(chunk)
        switch (obj.type) {
          case 'Ack1':
            ob.step2(obj.data, c)
            break
          case 'Ack2':
            // console.log('step3.2')
            ob.step4(obj.data, c)
            break
          case 'Ack3':
            ob.step5(obj.data)
            break
          case 'peer_query':
            // console.log('peer_query')
            ob.peer_query(obj.data, c)
            break
          case 'peer_response':
            ob.peer_response(obj.data)
            break
        }
      } catch (error) {
        console.log(error)
      }
    })
  })

  ob.server.on("close",function(){})
  return ob
}

let working_p2p = function (localhost, localport, callback, argu) {
  return Object.create(Working_p2p(localhost, localport, callback, argu))
}

exports.Working_p2p = Working_p2p
exports.working_p2p = working_p2p
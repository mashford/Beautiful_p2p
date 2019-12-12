### Beautiful-p2p

A peer-to-peer module finished in beautiful British Columbia.

#### Usage

```javascript
let beautiful_p2p = require('Beautiful-p2p').beautiful_p2p
let bp = beautiful_p2p('localhost',4321)
bp.event_center.on('newBroadcast', function(data){
  console.log(data)
})
bp.serve()
process.stdin.on('data', (data)=>{
  console.log(data.toString('utf8'))
  bp.broadcast(data.toString('utf8'))
})
```

#### APIs

beautiful_p2p(*localhost*, *localport*, *callback*, *argu*)

* localhost <String>	IP of your server
* localport <Number>    port to be used
* callback <Function>    optional, callback after connecting to a new node
* argu <any>    optional, arguments of callback

`Properties`

* sleeping_peers <Queue> a queue to keep 10 known peers, not necessary connected now but has been known as active nodes. Adding new peers results old peers being deleted.
* active_peers <Stack> a stack to keep up to 6 connected peers. The attempts adding new peers to a full stack will be rejected. 
* checklist <Checklist> record recent 5 messages
* name <String> name of this node
* server <net.Server>   server of this node

`Methords`

* serve():void start the server. Must be called.
* connect(*config*, *callback*, *argu*):void set up a new connection
  * config <Object> :{port: number, host: string}
  * callback<Function> optional, callback function
  * argu<any> optional, arguments for callback function

* check_connection(): void check if more peers are needed. Automatically called every 15s. 
* broadcast (msg): void broadcast a new message
  * msg<String> the message you want to broadcast.

`Events`

All events comes from `events` property

* newBroadcast  litsen to this event if you want to get information broad-casted in the network
  * msg <String> information being broadcasted 

* newConnection  triggered when a new connection was set up 
  * who<String> ip and port of the peer being connected

* error  emitted when an error is detected
  * msg<String> error information

* server_ready  emitted when the server is ready

* server_close  emitted when the server is about to close
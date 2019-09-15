let queue_little = require('./map.js').queue_little
function Checklist (length) {
  return {
    messages: queue_little(length),
    add: function(msg, who, active_peers) {
      if(this.messages.has(msg)){
        this.messages.get(msg).set(who, 1)
        return false
      } else {
        let peers = new Map()
        active_peers.forEach(element => {
          peers.set(element, 0)
        });
        // peers.add(who)
        peers.set(who, 1)
        this.messages.set(msg, peers)
        return true
      }
    },
    search: function () {
      let obj = {}
      this.messages.forEach((value, key) => {
        let arr = []
        value.forEach((_value, _key)=>{
          if(_value===0) arr.push(_key)
        })
        if (arr.length!==0) obj[key] = arr
      })
      return obj
    }
  }
}
function checklist (length) {
  let ck1 = Object.create(Checklist(length))//['local:1','local:2', 'local:3']})
  return ck1
}
exports.Checklist = Checklist
exports.checklist = checklist

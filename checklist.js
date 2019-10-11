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
    search: function (msg) {
      let obj = new Map()
      let arr = []
      this.messages.get(msg).forEach((value, key)=>{
        if(value===0) arr.push(key)
      })

      // this.messages.forEach((value, key) => {
      //   let arr = []
      //   value.forEach((_value, _key)=>{
      //     if(_value===0) arr.push(_key)
      //   })
      //   // if (arr.length!==0) obj[key] = arr
      //   if (arr.length!==0) obj.set(key, arr)
      // })
      return arr
    }
  }
}
function checklist (length) {
  let ck1 = Object.create(Checklist(length))//['local:1','local:2', 'local:3']})
  return ck1
}
exports.Checklist = Checklist
exports.checklist = checklist

// function show (obj) {
//   for (let [key, value] of Object.entries(obj)) {
//     console.log(`broadcast ${key} ::: ${value}`)
//     value.forEach((element) => {
//       console.log(`element:${element} key:${key}`)
//     })
//   }
// }
// let a = checklist(5)
// let peerlist = ['w1','w2','w3']
// a.add('m1', 'w1', peerlist)
// show(a.search())
// a.add('m1', 'w1', peerlist)
// show(a.search())
// a.add('m2', 'w2', peerlist)
// show(a.search())
// a.add('m2', 'w2', peerlist)
// show(a.search())
// a.add('m2', 'w1', peerlist)
// show(a.search())
function Stack(length) {
  return {
    map: new Map(),
    max_length: length,

    set: function(entries,value){
      if (this.map.size < this.max_length){
          // this.map.delete(this.map.entries().next().value[0])
          this.map.set(entries, value)
          return true
      } else {
        return false
      }
    },
    get: function(entry){
      return this.map.get(entry)
    },
    delete: function(entry){
      this.map.delete(entry)
    },
    keys: function(){
      let arr = []
      for(let i of this.map.keys()) {
        arr.push(i)
      }
      return arr
    },
    values: function(){
      let arr = []
      for(let i of this.map.values()) {
        arr.push(i)
      }
      return arr
    },
    pop: function(entry){
      // this.map.pop(entry)
    },
    size: function(){
      return this.map.size
    }
  }
}
function stack(length) {
  return Object.create(Stack(length))
}
exports.stack = stack
exports.Stack = Stack
// let q = new stack(3)
// q.set(1,'a')
// q.set(2,'b')
// q.set(3,'c')
// q.set(4,'d')
// let b = q.keys()
// let a = q.get(1)
// q.delete(3)
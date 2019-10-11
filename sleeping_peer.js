
function Queue(length) {
  let queue = {
    map: new Map(),
    max_length: length,
  
    set: function(entries,value){
      if (this.map.size === this.max_length){
          this.map.delete(this.map.entries().next().value[0])
      }
      this.map.set(entries,value)
    },
    add: function (value) {
      this.map.set(value,0)
    },
    addmany: function (value) {
      // if (typeof(value) == 'string') console.log('panic! string')
      for (let i of value) {
          this.map.set(i, 1)
      }
    },
    get: function (entry) {
      return this.map.get(entry)
    },
    delete: function (entry) {
      this.map.delete(entry)
    },
    pop: function(){
      let temp = this.map.entries().next().value[1]
      this.map.delete(this.map.entries().next().value[0])
      return temp
    },
    find_new: function (count) {
      if (count < 0) {
          count = this.map.size
      }
      let arr = []
      let t = (this.map.size - count) > 0 ? (this.map.size - count):0
      let i = 0
      for (let key of this.map.keys()) {
          i += 1
          if (i >= t) {
              arr.push(key)
          }
      }
      return arr
    }
  }
  queue.size = queue.map.size
  return queue
}
  // let q = new queue(3)
  // q.set(1,'a')
  // q.set(2,'b')
  // q.set(3,'c')
  // q.set(4,'d')
  // let a = q.find_new(-1)
  // console.log(a)
  // q.delete(3)
  function queue(length) {
    return Object.create(Queue(length))
  }

  exports.queue = queue
  exports.Queue = Queue
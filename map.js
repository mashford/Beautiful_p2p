function Queue (size) {
  return {
    map: new Map(),
    max_length: size,
    set: function(entries,value){
      if (this.map.size === this.max_length){
          this.map.delete(this.map.entries().next().value[0])
      }
      this.map.set(entries,value)
    },
    has: function (any) {
      return this.map.has(any)
    },
    get: function (any) {
      return this.map.get(any)
    },
    forEach: function (any) {
      return this.map.forEach(any)
    }
  }
}
function queue (size) {
  return Object.create(Queue(size))
}

exports.queue_little = queue
exports.Queue = Queue

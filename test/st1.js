const net = require('net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' 监听器
  console.log('已连接到服务器');
  client.write('你好世界!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
});
client.on('end', () => {
  console.log('已从服务器断开');
});
process.stdin.on('data', (data)=>{
  // console.log(data.toString('utf8'))
  client.write(data.toString('utf8')+'ooo')
  client.write(data.toString('utf8'))
})
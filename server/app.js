const Koa = require('koa');
const http = require('http');
const { Server } = require('socket.io');
const moment = require('moment');

const app = new Koa();

const chatList = [
  // {
  //   user: { name: '用户2', id: '2', avatar: '/src/assets/2.jpeg' },
  //   message: 'test',
  //   createTime: '2023-06-26 17:46:07',
  // },
];
const server = http.createServer(app.callback());
const io = new Server(server, {
  serveClient: false,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  io.sockets.emit('fresh-message', chatList);
  socket.on('send-message', (user, message) => {
    // console.log(user);
    // console.log(message);
    const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
    chatList.push({
      user,
      message,
      createTime,
    });
    io.sockets.emit('fresh-message', chatList);
  });
});

io.listen(3001);

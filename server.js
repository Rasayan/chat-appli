const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIO = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === '/chat') {
        await app.render(req, res, '/chat', query);
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = socketIO(server, {
    cors: {
      origin: 'http://localhost:3000', // Replace with your frontend URL
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`user with id-${socket.id} joined room - ${roomId}`);
    });
  
    socket.on("send_msg", (data) => {
      console.log(data, "DATA");
      //This will send a message to a specific room ID
      socket.to(data.roomId).emit("receive_msg", data);
    });
  
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  server
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

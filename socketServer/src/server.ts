import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/users'
import characterRoutes from './routes/characters'
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors'
import bodyParser from 'body-parser';

const prisma = new PrismaClient()

const app = express();
app.use(cors())
app.use(bodyParser.json())
const io = new Server({cors:{origin: ['http://localhost:4200']}})
app.use(function(req, res, next) {  
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Api-Key'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
});
const server = createServer(app)
const port = 3000;
const ws_port = 3001

userRoutes(app, prisma)
characterRoutes(app, prisma)



app.get('/', async (req, res) => {
    const users = await prisma.users.findMany()
    res.send(users);
});

io.on('connection', (socket) => {
  console.log('a user connected with ID:', socket.id);
});

server.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

io.listen(ws_port)
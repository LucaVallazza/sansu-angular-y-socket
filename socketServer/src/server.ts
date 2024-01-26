import express from "express";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/users";
import optionRoutes from "./routes/options";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import socket from "./socket/socket";

export const prisma = new PrismaClient();

export const app = express();
app.use(cors());
app.use(bodyParser.json());
export const io = new Server({ cors: { origin: ["http://localhost:4200"] } });
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, X-Api-Key"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if ("OPTIONS" === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});
export const server = createServer(app);
const port = 3000;
const ws_port = 3001;

app.delete('/restart', async ()=>{
  await prisma.option.deleteMany()
  await prisma.user.deleteMany()
})

userRoutes();
optionRoutes();
socket()


server.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

io.listen(ws_port);



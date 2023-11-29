import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/users'
import characterRoutes from './routes/characters'

const prisma = new PrismaClient()
const app = express();
const port = 4000;

userRoutes(app, prisma)
characterRoutes(app, prisma)



app.get('/', async (req, res) => {
    const users = await prisma.users.findMany()
    res.send(users);
});


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
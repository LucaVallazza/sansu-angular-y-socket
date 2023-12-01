import { PrismaClient } from "@prisma/client";
import { Express } from "express";

const USERS_PATH = "/users";

export default function (app: Express, prisma: PrismaClient) {
  app.get(`${USERS_PATH}`, async (req, res) => {
    const users = await prisma.users.findMany();
    res.status(200).send(users);
  });

  // Put donde se mandan votes y id y se actualizan los votos, ademas de setear hasShown a true
  app.put(`${USERS_PATH}/showVotes`, async (req, res) => {
    const body = req.body;
    if (!body.id || !body.votes) {
      res.status(300).send("La informacion se mando en un formato incorrecto");
    }

    const user = await prisma.users.findMany({where: {id: body.id}});

    if(!user){
        res.status(200).send('No se encontro ningun usuario')
    }
    else if(user.length > 1 ){
        prisma.users.deleteMany({where: {id: body.id}})
        res.status(409).send('Hay 2 usuarios con ese ID. Ambos fueron eliminados')
    }else{
        await prisma.users.update({where: {id: body.id},data : {votes: body.votes, hasShown: true}})
        .catch((e)=>{
            res.status(500).send('Hubo un error al actualizar los usuarios').json({error: e})
        })
        
        res.status(201).send('Se actualizaron los usuarios')
    }
  });

  // Mandamos user y creamos nuevo user si no hay otro que se llama igual
  app.post(`${USERS_PATH}/add`, async (req, res) => {
    console.log(`POST a :${USERS_PATH}/add`)
    const body = req.body;
    if (!body.name) {
      res.status(300).send("La informacion se mando en un formato incorrecto");
    }

    const user = await prisma.users.findMany({where: {name: body.name}});

    if(user.length === 0){
        const newUser = {
            name : body.name,
            hasShown: false,
            votes : []
        }
        const user = await prisma.users.create({data:newUser})    
        res.status(201).json({user:user, message: "Usuario creado!"})
    }
    else if(user.length > 1 ){
        prisma.users.deleteMany({where: {id: body.id}})
        res.status(409).send('Hay 2 usuarios con ese ID. Ambos fueron eliminados')
    }else{
        res.status(200).json({user:user[0] , message: "Ya hay un usuario con ese nombre!"})
    }
  })

}



import { PrismaClient } from "@prisma/client";
import { Express } from "express";

const CHARACTERS_PATH = "/characters";

export default function (app: Express, prisma: PrismaClient) {
  app.get(`${CHARACTERS_PATH}`, async (req, res) => {
    const characters = await prisma.character.findMany();
    res.status(200).send(characters);
  });

  // Put donde se manda id y se borra el character
  app.delete(`${CHARACTERS_PATH}/remove`, async (req, res) => {
    const body = req.body;
    if (!body.id) {
      res.status(300).send("La informacion se mando en un formato incorrecto");
    }

    const character = await prisma.character.findMany({where: {id: body.id}});

    if(!character){
        res.status(200).send(`No se encontro ningun character con el id ${body.id}`)
    }
    else{
        await prisma.character.delete({where: {id: body.id}})
        .catch((e)=>{
            res.status(500).send({error: e, message: 'Error al eliminar character'})
        })
        
        res.status(201).send(`Se eliminó el personaje con id ${body.id}`)
    }
  });

  // Mandamos description y creamos nuevo character si no hay otro que se llama igual
  app.post(`${CHARACTERS_PATH}/add`, async (req, res) => {
    const body = req.body;
    if (!body.description) {
      res.status(300).send("La informacion se mando en un formato incorrecto");
    }

    const character = await prisma.character.findMany({where: {description: body.description}});

    if(!character){
        const newcharacter = {
            description: body.description
        }
        const character = await prisma.character.create({data:newcharacter})    
        res.status(201).send({character:character})
    }
    else if(character.length > 1 ){
        prisma.character.deleteMany({where: {description: body.description}})
        res.status(409).send('Hay 2 characters con esa descripcion. Ambos fueron eliminados')
    }else{
        res.status(304).json({character})
    }
  });

}

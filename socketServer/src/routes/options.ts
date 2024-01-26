

import { PrismaClient } from "@prisma/client";
import { Express } from "express";
import { app, prisma } from "../server";

const OPTIONS_PATH = "/options";

export default function () {
  app.get(`${OPTIONS_PATH}`, async (req, res) => {
    const options = await prisma.option.findMany();
    res.status(200).send(options);
  });

  // Put donde se manda id y se borra el option
  app.delete(`${OPTIONS_PATH}/remove`, async (req, res) => {
    const body = req.body;
    if (!body.id) {
      res.status(300).send("La informacion se mando en un formato incorrecto");
    }

    const option = await prisma.option.findMany({where: {id: body.id}});

    if(!option){
        res.status(200).send(`No se encontro ningun option con el id ${body.id}`)
    }
    else{
        await prisma.option.delete({where: {id: body.id}})
        .catch((e)=>{
            res.status(500).send({error: e, message: 'Error al eliminar option'})
        })
        
        res.status(201).send(`Se eliminó el personaje con id ${body.id}`)
    }
  });

  // Mandamos description y creamos nuevo option si no hay otro que se llama igual
  app.post(`${OPTIONS_PATH}/add`, async (req, res) => {
    const body = req.body;
    if (!body.description) {
      res.status(300).send("La informacion se mando en un formato incorrecto");
    }

    const option = await prisma.option.findMany({where: {description: body.description}});

    if(!option){
        const newoption = {
            description: body.description
        }
        const option = await prisma.option.create({data:newoption})    
        res.status(201).send({option:option})
    }
    else if(option.length > 1 ){
        await prisma.option.deleteMany({where: {description: body.description}})
        res.status(409).send('Hay 2 options con esa descripcion. Ambos fueron eliminados')
    }else{
        res.status(304).json({option})
    }
  });

}

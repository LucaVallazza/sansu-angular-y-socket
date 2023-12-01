import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { io, prisma } from "../server";

export default function () {

    io.on("connection", async (socket) => {

        //Log that there is a new user
        console.log("a user connected with ID:", socket.id);
        
        // Get characters and users and send them to the new socket
        const users =  await prisma.users.findMany()
        const characters =  await prisma.character.findMany()
        io.emit('update-users', users , characters)
      
        socket.on("add-character", (description) => {
          console.log(socket.id, " quiere agregar a ", description);
      
          io.emit('update-users', handleAddCharacter(description))
        });
      
      });


      async function handleAddCharacter(description: string) { 

        console.log('ADDING CHARACTER : ', description)
        const characters = await prisma.character.findMany();
        console.log('    characters : ', characters)
        
        const character = characters.find(char => char.description === description)
        console.log('    character : ', character)
        
        if (!character) {
          const newUser = await prisma.character.create({ data: { description: description } });
          console.log('    User creado!')
          characters.push(newUser)
        } else {
          console.log('    User ya existe!')
        }
        
        
      }
}
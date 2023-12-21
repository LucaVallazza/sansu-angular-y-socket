import { io, prisma } from "../server";

export default function () {
  io.on("connection", async (socket) => {
    //Log that there is a new user
    console.log("a user connected with ID:", socket.id);

    // Get characters and users and send them to the new socket
    const users = await prisma.users.findMany({orderBy: {name: 'asc'}});
    const characters = await prisma.character.findMany({orderBy: {id: 'asc'}});
    io.emit("update-users", users, characters);

    socket.on("add-character", (description) => {
      console.log(
        "ADD-CHARACTER ||",
        socket.id,
        " quiere agregar a ",
        description
      );

      io.emit("update-characters", handleAddCharacter(description));
    });

    socket.on("event", (description) => {
      console.log("EVENTO!", socket.id, " quiere agregar a ", description);
      console.log("emitting event");
      io.emit("event", "recieved!");
      io.emit("update-characters", handleAddCharacter(description));
    });

    socket.on('addCharacter', async (description) =>{
      console.log('Adding character with description: ', description)

      await prisma.character.create({data: {description: description} })
      .catch(e =>{
        console.log(e)
        return
      })

      const characters = await prisma.character.findMany()

      io.emit('updateCharacters' , characters )

    })
    socket.on('removeCharacter', async (description) =>{
      console.log('Deleting character with description: ', description)

      const deletedCharacter = await prisma.character.findUnique({where: {description : description} })
      await prisma.character.delete({where: {description: description} })
      .catch(e =>{
        console.log(e)
        return
      })

      const users = await prisma.users.findMany({orderBy: {name: 'asc'}})
      const characters = await prisma.character.findMany({orderBy: {id: 'asc'}})
      

      console.log(users)
      users.forEach(async (user) => {
        if(user.votes.includes(deletedCharacter.id)){
          console.log( user.name ,' antes : ', user.votes)

          user.votes.splice(user.votes.indexOf(deletedCharacter.id), 1)

          console.log( user.name ,' despues de borrar [' , deletedCharacter.id , '] : ', user.votes)

          await prisma.users.update({data: {votes: user.votes} , where: {id: user.id}} )
        }

      });


      console.log(users)
      
      io.emit('updateUsers' , users)
      io.emit('updateCharacters' , characters )

    })

    socket.on("updateUser", async (user) => {
      console.log("||updateUser || ");
      console.log("user:");
      console.log(user);

      await prisma.users
        .update({
          where: { name: user.name },
          data: {
            votes: user.votes,
            hasShown: user.hasShown,
          },
        })
        .catch((e) => {
          {
            console.log(e);
            return
          }
      });

      // Emit an event to update the characters on the clients
      const users = await prisma.users.findMany({orderBy: {name: 'asc'}})



      io.emit('updateUsers', users)

    });

    async function handleAddCharacter(description: string) {
      console.log("ADDING CHARACTER : ", description);
      const characters = await prisma.character.findMany();
      console.log("    characters : ", characters);

      const character = characters.find(
        (char) => char.description === description
      );
      console.log("    character : ", character);

      if (!character) {
        const newCharacter = await prisma.character.create({
          data: { description: description },
        });
        console.log("    Character creado!");
        characters.push(newCharacter);
      } else {
        console.log("    Character ya existe!");
      }
    }

    async function handleAddUser(name: string) {
      console.log("ADDING USER : ", name);
      const users = await prisma.users.findMany();

      console.log("    users : ", users);

      const user = users.find((user) => user.name === name);
      console.log("    user : ", user);

      if (!user) {
        const newUser = await prisma.users.create({
          data: { name: name },
        });
        console.log("    User creado!");
        users.push(newUser);
      } else {
        console.log("    User ya existe!");
      }
    }
  });
}

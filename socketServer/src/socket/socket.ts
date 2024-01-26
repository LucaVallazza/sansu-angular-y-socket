import { UserType } from "../assets/types";
import { io, prisma } from "../server";

export default function () {
  io.on("connection", async (socket) => {
    //Log that there is a new user
    console.log("a user connected with ID:", socket.id);

    // Get Options and users and send them to the new socket
    const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
    const Options = await prisma.option.findMany({ orderBy: { id: "asc" } });
    io.emit("update-users", users, Options);

    socket.on("add-Option", (description) => {
      console.log(
        "ADD-Option ||",
        socket.id,
        " quiere agregar a ",
        description
      );

      io.emit("update-Options", handleAddOption(description));
    });

    // ## EVENT ##
    socket.on("event", (description) => {
      console.log("EVENTO!", socket.id, " quiere agregar a ", description);
      console.log("emitting event");
      io.emit("event", "recieved!");
      io.emit("update-Options", handleAddOption(description));
    });

    // ## ADD OPTION ##
    socket.on("addOption", async (description) => {
      console.log("Adding Option with description: ", description);

      await prisma.option
        .create({ data: { description: description } })
        .catch((e) => {
          console.log(e);
          return;
        });

      const Options = await prisma.option.findMany();

      io.emit("updateOptions", Options);
    });

    // ## REMOVE OPTION ##
    socket.on("removeOption", async (description) => {
      console.log("Deleting Option with description: ", description);

      const deletedOption = await prisma.option.findUnique({
        where: { description: description },
      });
      await prisma.option
        .delete({ where: { description: description } })
        .catch((e) => {
          console.log(e);
          return;
        });

      const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
      const Options = await prisma.option.findMany({ orderBy: { id: "asc" } });

      console.log(users);
      users.forEach(async (user) => {
        if (user.votes.includes(deletedOption.id)) {
          console.log(user.name, " antes : ", user.votes);

          user.votes.splice(user.votes.indexOf(deletedOption.id), 1);

          console.log(
            user.name,
            " despues de borrar [",
            deletedOption.id,
            "] : ",
            user.votes
          );

          await prisma.user.update({
            data: { votes: user.votes },
            where: { id: user.id },
          });
        }
      });

      console.log(users);

      io.emit("updateUsers", users);
      io.emit("updateOptions", Options);
    });

    // ## UPDATE USER ##
    socket.on("updateUser", async (user) => {
      console.log("||updateUser || ");
      console.log("user:");
      console.log(user);

      await prisma.user
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
            return;
          }
        });

      // Emit an event to update the Options on the clients
      const users = await prisma.user.findMany({ orderBy: { name: "asc" } });

      io.emit("updateUsers", users);
    });

    // ## ADD USER ##
    socket.on("addUser", async (userName : string) => {
      console.log(" adduser with the following params : ", userName);

      const user : UserType = await prisma.user.findFirst({ where: { name: userName } })

      if (!user){
        console.log('adding!')
        const newUser = await prisma.user.create({ data: { name: userName } })

        const newUsers = await prisma.user.findMany({ orderBy: { name: "asc" } })
        const options = await prisma.option.findMany()
  
        socket.emit('loadGame', newUsers, options, newUser)
        io.emit("updateUsers", newUsers);

        console.log('User creado!')

      }else{
        console.log('user exists')

        const newUsers = await prisma.user.findMany({ orderBy: { name: "asc" } })
        const options = await prisma.option.findMany()

        socket.emit('loadGame', users, options, user)
        io.emit("updateUsers", newUsers);

        console.log('User creado!')

      }

    });

    socket.on("resetData", async () => {});

    socket.on("userDisconnect", async (user: UserType) => {
      if (user == null || user == undefined) {
        return;
      }
      console.log("Disconnecting user ", user, " ...");
      await prisma.user
        .deleteMany({ where: { name: user.name, id: user.id } })
        .catch((e) => {
          console.log("Error deleting the user :", user);
          console.log(e);
        });

      // Emit an event to update the Options on the clients
      const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
      io.emit("updateUsers", users);
    });

    async function handleAddOption(description: string) {
      console.log("ADDING Option : ", description);
      const Options = await prisma.option.findMany();
      console.log("    Options : ", Options);

      const Option = Options.find((opt) => opt.description === description);
      console.log("    Option : ", Option);

      if (!Option) {
        const newOption = await prisma.option.create({
          data: { description: description },
        });
        console.log("    Option creado!");
        Options.push(newOption);
      } else {
        console.log("    Option ya existe!");
      }
    }

    async function handleAddUser(name: string) {
      console.log("ADDING USER : ", name);
      const users = await prisma.user.findMany({
        where: { name: name.toLowerCase() },
      });

      console.log("    users : ", users);

      const user = users.find((user) => user.name === name);
      console.log("    user : ", user);

      if (!user) {
        const newUser = await prisma.user.create({
          data: { name: name.toLowerCase() },
        });
        console.log("    User creado!");
        users.push(newUser);
      } else {
        console.log("    User ya existe!");
      }
    }

    async function handleRemoveUser(user: UserType) {
      const deletedUsers = await prisma.user.deleteMany({
        where: {
          name: user.name,
          id: user.id,
        },
      });

      if (deletedUsers) {
        return true;
      } else {
        return false;
      }
    }
  });
}

import { createServer } from "http";
import { Server } from "socket.io";

interface User {
  id: string;
  name: string;
  room: string;
}

const httpServer = createServer();
const ADMIN = "Admin";

// state for users
const UsersState = {
  users: [] as User[],
  setUsers: function (newUsersArray: any) {
    this.users = newUsersArray;
  },
};

const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
    // "*",
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // upon connection - only to user
  // socket.emit("message", "Welcome to Chat App!");
  socket.emit("message", buildMsg(ADMIN, "Welcome to Chat App!"));

  //
  socket.on("enterRoom", ({ name, room }) => {
    // leave prev room
    const prevRoom = getUser(socket.id)?.room;

    if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit(
        "message",
        buildMsg(ADMIN, `${name} has left the room`)
      );
    }

    const user = activateUser(socket.id, name, room);

    // Cannot update prev room users list until after the state update in activate user
    if (prevRoom) {
      const usersInPrevRoom = getUsersInRoom(prevRoom);
      console.log(`Users in room ${prevRoom} before update:`, usersInPrevRoom);

      io.to(prevRoom).emit("userList", {
        users: usersInPrevRoom,
      });
    }

    // join room
    socket.join(user.room);

    // To the user who joined
    socket.emit(
      "message",
      buildMsg(ADMIN, `You have joined the ${user.room} chat room`)
    );

    // To everyone else
    socket.broadcast
      .to(user.room)
      .emit("message", buildMsg(ADMIN, `${user.name} has joined the room`));

    // update user list for room
    io.to(user.room).emit("userList", {
      users: getUsersInRoom(user.room),
    });

    // update the room list for everyone
    io.emit("roomList", {
      rooms: getAllActiveRooms(),
    });
  });

  // when user disconnects - to all others
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    userLeavesApp(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        buildMsg(ADMIN, `${user.name} has left the room`)
      );

      io.to(user.room).emit("userList", {
        users: getUsersInRoom(user.room),
      });

      io.emit("roomList", {
        rooms: getAllActiveRooms(),
      });
    }

    console.log(`User ${socket.id} disconnected`);

    // socket.broadcast.emit(
    //   "message",
    //   `User ${socket.id.substring(0, 5)} disconnected`
    // );
  });

  // upon connection - to all others
  // socket.broadcast.emit(
  //   "message",
  //   `User ${socket.id.substring(0, 5)} connected`
  // );

  // listening for a message event
  socket.on("message", ({ name, text }) => {
    const room = getUser(socket.id)?.room;

    if (room) {
      io.to(room).emit("message", buildMsg(name, text));
    }
  });

  // listening for activity
  socket.on("activity", (name) => {
    const room = getUser(socket.id)?.room;

    if (room) {
      socket.broadcast.to(room).emit("activity", name);
    }
  });

  socket.on("postQuestion", ({ question, options }) => {
    const room = getUser(socket.id)?.room;

    if (room) {
      io.to(room).emit("broadcastQuestion", {
        question,
        options,
      });
    }
  });
});

httpServer.listen(3001, () => {
  console.log("listening on port 3001");
});

const buildMsg = (name: string, text: string) => {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date()),
  };
};

// User functions
const activateUser = (id: string, name: string, room: string) => {
  const user: User = { id, name, room };
  UsersState.setUsers([
    ...UsersState.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
};

const userLeavesApp = (id: string) => {
  UsersState.setUsers(UsersState.users.filter((user) => user.id !== id));
};

const getUser = (id: string) => {
  return UsersState.users.find((user) => user.id === id);
};

const getUsersInRoom = (room: string) => {
  return UsersState.users.filter((user) => user.room === room);
};

const getAllActiveRooms = () => {
  return Array.from(new Set(UsersState.users.map((user) => user.room)));
};

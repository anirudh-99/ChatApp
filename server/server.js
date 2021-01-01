const express = require("express");
const mongoose = require("mongoose");
const Pusher = require("pusher");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authController = require("./controllers/authController");

const roomRoutes = require("./routes/roomRoutes");

//importing models
const Rooms = require("./models/room.model.js");

dotenv.config({ path: "./config.env" });

//------------app config-------------
const app = express();
const port = process.env.PORT || 3001;

const pusher = new Pusher({
  appId: "1120906",
  key: "f891c6ff78f3484303a0",
  secret: "a9a7a8c92da6d4968e11",
  cluster: "ap2",
  useTLS: true,
});

//------------middleware--------------
app.use(morgan("combined"));
app.use(express.json());
app.use(cors());

//-------------------db config-----------------

mongoose
  .connect(process.env.DB_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("db connection successful");

    //change stream for "Rooms" collection
    Rooms.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const room = change.fullDocument;
        pusher.trigger("rooms", "room added", {
          ...room,
        });
      } else if (change.operationType === "update") {
        const roomId = change.documentKey._id;
        let lastAddedMsg = await Rooms.findById(roomId).select({
          messages: { $slice: -1 },
        });
        lastAddedMsg = lastAddedMsg.messages[0];
        pusher.trigger("messages", "message added", { ...lastAddedMsg });
      }
    });
  });

//-------------api routes--------------------------

// authentication routes
app.post("/login", authController.login);
app.post("/signup", authController.signUp);
app.get("/verifyToken/:token", authController.verifyToken);

app.use("/rooms", roomRoutes);

//start server
app.listen(port, () => console.log(`listening on localhost:${port}`));

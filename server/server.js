const express = require("express");
const mongoose = require("mongoose");
const Pusher = require("pusher");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authController = require("./controllers/authController");

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

    // //Change stream for "Messages" collection
    // Messages.watch().on("change", (change) => {
    //   if (change.operationType === "insert") {
    //     const message = change.fullDocument;
    //     pusher.trigger("messages", "inserted", {
    //       ...message,
    //     });
    //   }
    // });

    //change stream for "Rooms" collection
    Rooms.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const room = change.fullDocument;
        pusher.trigger("rooms", "room added", {
          ...room,
        });
      } else if (change.operationType === "update") {
        // clusterTime: Timestamp { _bsontype: 'Timestamp', low_: 2, high_: 1608126502 },
        // ns: { db: 'whtasappDb', coll: 'rooms' },
        // documentKey: { _id: 5fda0df83dfdbb686ffd177f },
        // updateDescription: { updatedFields: { 'messages.2': [Object] }, removedFields: [] }
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

// additional routes
app.post("/login", authController.login);
app.post("/signup", authController.signUp);
app.get("/verifyToken/:token", authController.verifyToken);

//route for getting all room names
app.get("/rooms", authController.protect, (req, res) => {
  Rooms.find()
    .then((data) => res.status(200).send(data))
    .catch((err) =>
      res.status(500).send({
        status: "fail",
        message: err.message,
      })
    );
});

// route for creating new rooms
app.post("/rooms", authController.protect, (req, res) => {
  const room = req.body;

  Rooms.create(room)
    .then((data) => res.status(201).send(data))
    .catch((err) =>
      res.status(500).send({
        status: "fail",
        message: err.message,
      })
    );
});

// route for getting all messages in a room
app.get("/rooms/:roomId/messages", authController.protect, async (req, res) => {
  const roomId = req.params.roomId;

  const messages = await Rooms.findById(roomId).select("messages -_id");
  res.status(200).json({ status: "success", data: messages });
});

app.patch(
  "/rooms/:roomId/messages",
  authController.protect,
  async (req, res) => {
    const roomId = req.params.roomId;
    const updatedRoom = await Rooms.findByIdAndUpdate(
      roomId,
      {
        $push: { messages: req.body },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ status: "success", message: "message successfully added" });
  }
);

//listen
app.listen(port, () => console.log(`listening on localhost:${port}`));

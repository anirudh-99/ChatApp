import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import cors from "cors";
import morgan from "morgan";

//importing models
import Messages from "./models/message.model.js";
import Rooms from "./models/room.model.js";

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
app.use(morgan());
app.use(express.json());
app.use(cors());

//-------------------db config-----------------
const connectionURL =
  "mongodb+srv://anirudh:5vJLI9g62rWusBUc@cluster0.pjikp.mongodb.net/whtasappDb?retryWrites=true&w=majority";

mongoose
  .connect(connectionURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connection successful");

    //Change stream for "Messages" collection
    Messages.watch().on("change", (change) => {
      if (change.operationType === "insert") {
        const message = change.fullDocument;
        pusher.trigger("messages", "inserted", {
          ...message,
        });
      }
    });

    //change stream for "Rooms" collection
    Rooms.watch().on("change", (change) => {
      if (change.operationType === "insert") {
        const room = change.fullDocument;
        pusher.trigger("rooms", "inserted", {
          ...room,
        });
      }
    });
  });

//-------------api routes--------------------------
app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages", (req, res) => {
  Messages.find()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

// route for creating new message
app.post("/messages", (req, res) => {
  const message = req.body;

  Messages.create(message, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/rooms", (req, res) => {
  Rooms.find()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

// route for creating new rooms
app.post("/rooms", (req, res) => {
  const room = req.body;

  Rooms.create(room)
    .then((data) => res.status(201).send(data))
    .catch((err) => res.status(500).send(err));
});

//listen
app.listen(port, () => console.log(`listening on localhost:${port}`));

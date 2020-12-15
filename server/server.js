const express = require("express");
const mongoose = require("mongoose");
const Pusher = require("pusher");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authController = require("./controllers/authController");

//importing models
const Messages = require("./models/message.model.js");
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
app.use(morgan());
app.use(express.json());
app.use(cors());

//-------------------db config-----------------

mongoose
  .connect(process.env.DB_STRING, {
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

// additional routes 
app.post("/login", authController.login);
app.post("/signup", authController.signUp);
app.get('/verifyToken/:token',authController.verifyToken);

app.get("/messages", authController.protect, (req, res) => {
  Messages.find()
    .then((data) => res.status(200).send(data))
    .catch((err) =>
      res.status(500).send({
        status: "fail",
        message: err.message,
      })
    );
});

// route for creating new message
app.post("/messages", authController.protect, (req, res) => {
  const message = req.body;

  Messages.create(message, (err, data) => {
    if (err) {
      return res.status(500).send({
        status: "fail",
        message: err.message,
      });
    } else {
      res.status(201).send(data);
    }
  });
});

//route for getting all route names
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

//listen
app.listen(port, () => console.log(`listening on localhost:${port}`));

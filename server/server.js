import express from "express";
import mongoose from "mongoose";
import Messages from "./models/message.model.js";
import Pusher from "pusher";
import cors from "cors";


//app config
const app = express();
const port = process.env.PORT || 3001;

const pusher = new Pusher({
  appId: "1120906",
  key: "f891c6ff78f3484303a0",
  secret: "a9a7a8c92da6d4968e11",
  cluster: "ap2",
  useTLS: true,
});

//middleware
app.use(express.json());
app.use(cors());

//db config
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

    //Change stream
    Messages.watch().on("change", (change) => {
      if (change.operationType === "insert") {
        const message = change.fullDocument;
        pusher.trigger("messages", "inserted", {
          ...message
        });
      }
    });
  });

//api routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages", (req, res) => {
  Messages.find()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

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

//listen
app.listen(port, () => console.log(`listening on localhost:${port}`));
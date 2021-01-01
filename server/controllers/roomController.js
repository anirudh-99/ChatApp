const Rooms = require("../models/room.model");

exports.getAllRooms = (req, res) => {
  Rooms.find()
    .then((data) => res.status(200).send(data))
    .catch((err) =>
      res.status(500).send({
        status: "fail",
        message: err.message,
      })
    );
};

exports.createRoom = (req, res) => {
  const room = req.body;

  Rooms.create(room)
    .then((data) => res.status(201).send(data))
    .catch((err) =>
      res.status(500).send({
        status: "fail",
        message: err.message,
      })
    );
};

exports.getMessagesInARoom = async (req, res) => {
  const roomId = req.params.roomId;

  const messages = await Rooms.findById(roomId).select("messages -_id");
  res.status(200).json({ status: "success", data: messages });
};

exports.addMessageToRoom = async (req, res) => {
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
};

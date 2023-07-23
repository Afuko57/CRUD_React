const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const { MongoClient } = require("mongodb");
const uri = "mongodb://myUserAdmin:myUserAdmin@127.0.0.1:27017";

app.post("/users/create", async (req, res) => {
  const user = req.body;
  try {
    const client = new MongoClient(uri, options);
    await client.connect();

    const collection = client.db("admin").collection("users");

    await collection.insertOne({
      id: parseInt(user.id),
      fname: user.fname,
      lname: user.lname,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
    await client.close();

    res.status(200).send({
      status: "ok",
      message: "User with ID = " + user.id + " is created",
      user: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({
      status: "error",
      message: "An error occurred while creating the user",
      error: error.message, //  error message in the response
    });
  }
});

//Get all
app.get("/users", async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const users = await client.db("admin").collection("users").find({}).toArray();
  await client.close();
  res.status(200).send(users);
});

//Get by id
app.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const user = await client.db("admin").collection("users").findOne({ id: id });
  await client.close();
  res.status(200).send({
    status: "ok",
    user: user,
  });
});

//Get by id
app.put("/users/update", async (req, res) => {
  const user = req.body;
  const id = parseInt(user.id);
  const client = new MongoClient(uri);
  await client.connect();
  await client
    .db("admin")
    .collection("users")
    .updateOne(
      { id: id },
      {
        $set: {
          id: parseInt(user.id),
          fname: user.fname,
          lname: user.lname,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      }
    );
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "User with ID = " + id + " is updated",
    user: user,
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});

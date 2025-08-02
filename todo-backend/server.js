//Using Express
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
require('dotenv').config();

//create an instance of express
const app = express();
app.use(express.json());
app.use(cors())

//Sample in-memory storage for todo items

//Connect the mongodb
mongoose
  .connect(process.env.MONGO_URL)  // Use MONGO_URL from .env
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//creating schema
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

//Creating model
const todomodel = mongoose.model("todo", todoSchema);


//Create a new todo item
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new todomodel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//Get all the item
app.get("/todos", async (req, res) => {
  try {
    const todos = await todomodel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//Update a todo items
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const UpdateTodo = await todomodel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      {
        new: true,
      }
    );
    if (!UpdateTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(UpdateTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//Delete a todo item
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todomodel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log("Server running on port" + PORT);
// });


module.exports = app;
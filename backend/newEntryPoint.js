const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const itemSchema = require('./newSchema');
require('dotenv').config({ path: './config.env' });

const connectDB = require('./newDatabaseTest'); // mongoose connection
connectDB();

// SHould be connected to bigSpoonYum
// mongoose.connection.once("open", () => {
//   console.log("Connected to DB:", mongoose.connection.name);
// });


const app = express();
app.use(cors());
app.use(express.json());

// Display items at http://localhost:5000/items
app.get("/items", async (req, res) => {
  try {
    const items = await itemSchema.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching newSchema:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// const Recipe = require("./newSchema");
//
// Insert a clean recipe
// app.get("/seed", async (req, res) => {
//   try {
//     const sample = new Recipe({
//       name: "Bacon Pepperoni",
//       ingredients: [
//         { name: "Bacon", quantity: 1, unit: "lb" },
//         { name: "Pepperoni", quantity: 1000, unit: "slices" },
//         { name: "Butter", quantity: 6, unit: "lb"}
//       ],
//       filters: ['Vegan', 'Lactose-Free'],      
//       instructions: "Mix cous cous with fibars and cook for 10 minutes.",
//       time: 60,
//       numberOfPeople: 5,
//     });

//     await sample.save();
//     res.send("Successful insert");
//   } catch (err) {
//     console.error("Error seeding recipe:", err);
//     res.status(500).send(err.message);
//   }
// });


// CRUD
const CRUD = require('./CRUD');
app.use('/items', CRUD);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

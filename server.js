require("dotenv").config();

const express = require("express");

const dbConnect = require("./db");

const CategoryRoute = require("./controllers/Categorycontrollers");
const itemRoute = require("./controllers/Itemcontrollers");
const todoRoute = require("./controllers/Todocontrollers");
const cors = require('cors')

const app = express();


const PORT = process.env.PORT || 5000;
app.use(cors ())
app.use(express.json());

app.use("/category", CategoryRoute);
app.use("/item", itemRoute);
app.use("/todo", todoRoute);

dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running PORT=${PORT}`);
});

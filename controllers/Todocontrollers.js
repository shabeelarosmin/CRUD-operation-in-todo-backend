const express = require("express");

const todoRoute = express.Router();

const Todo = require("../models/Todomodel");
const Category = require("../models/Categorymodel");




todoRoute.post("/create", async (req, res) => {
  try {
     console.log("REQ BODY:", req.body);
      console.log("CONTENT TYPE:", req.headers["content-type"]);
    const { name, description, category } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({
        message: "Name, description and category are required",
      });
    }

    const categoryData = await Category.findById(category);

    if (!categoryData) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const todo = await Todo.create({
      name,
      description,
      category,
    });

    await Category.findByIdAndUpdate(category, {
      todo: todo._id,
    });
    return res.status(201).json({
      message: "Todo created successfully",
      data: todo,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});


todoRoute.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().populate("category", "name description");

    return res.status(200).json({
      data: todos,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});







todoRoute.put("/update/:id", async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const id = req.params.id;

    const existingTodo = await Todo.findById(id);

    if (!existingTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    if (category && category !== existingTodo.category.toString()) {
      const newCategory = await Category.findById(category);

      if (!newCategory) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

     
      await Category.findByIdAndUpdate(existingTodo.category, {
        $unset: { todo: 1 },
      });

     
      await Category.findByIdAndUpdate(category, {
        todo: existingTodo._id,
      });

      existingTodo.category = category;
    }

    existingTodo.name = name;
    existingTodo.description = description;

    await existingTodo.save();

    return res.status(200).json({
      message: "Todo updated successfully",
      data: existingTodo,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});




todoRoute.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const existingTodo = await Todo.findById(id);

    if (!existingTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

   
    await Category.findByIdAndUpdate(existingTodo.category, {
      $unset: { todo: 1 },
    });

  
    await Todo.deleteOne({ _id: id });

    return res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = todoRoute;

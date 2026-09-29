const express = require("express");

const itemRoute = express.Router();

const Item = require("../models/itemmodel");
const Category = require("../models/Categorymodel");


itemRoute.post("/create", async (req, res) => {
  try {
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

    
    const item = await Item.create({
      name,
      description,
      category,
    });

    return res.status(201).json({
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});


itemRoute.get("/", async (req, res) => {
  try {

    const items = await Item.find().populate({
      path: "category",
      select: "name description todo",
      populate: {
        path: "todo",
        select: "name description",
      },
    });
    

    return res.status(200).json({
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});






itemRoute.put("/update/:id", async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const id = req.params.id;

    const existingItem = await Item.findById(id);

    if (!existingItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (category) {
      const categoryData = await Category.findById(category);

      if (!categoryData) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      existingItem.category = category;
    }

    existingItem.name = name;
    existingItem.description = description;

    await existingItem.save();

    return res.status(200).json({
      message: "Item updated successfully",
      data: existingItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});







itemRoute.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const existingItem = await Item.findById(id);

    if (!existingItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    await Item.deleteOne({ _id: id });

    return res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = itemRoute;

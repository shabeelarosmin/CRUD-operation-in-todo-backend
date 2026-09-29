const express = require("express");

const categoryRoute = express.Router();

const Category = require("../models/Categorymodel");


categoryRoute.post("/create", async (req, res) => {
  try {
    console.log(req.body);

    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "name, description are required",
      });
    }

    const newData = await Category.create({
      name,
      description,
    });

    return res.status(201).json({
      data: newData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});


categoryRoute.get("/", async (req, res) => {
  try {
    const categories = await Category.find().populate("items");

    return res.status(200).json({
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});





categoryRoute.put("/update/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const id = req.params.id;

    const existingData = await Category.findById(id);

    if (!existingData) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    existingData.name = name;
    existingData.description = description;

    await existingData.save();

    return res.status(200).json({
      data: existingData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});


categoryRoute.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const existingData = await Category.findById(id);

    if (!existingData) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await Category.deleteOne({ _id: id });

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = categoryRoute;

const { response, request } = require("express");
const Category = require("../models/category");

const getCategories = async (req, res = respone) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate("user", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    categories,
  });
};

const getCategory = async (req, res = response) => {
  const { id } = req.params;
  const query = { _id: id };

  const category = await Category.find(query).populate("user", "name");

  res.json(category);
};

const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      msg: `La categoria ${categoryDB.name} ya existe`,
    });
  }

  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);
  await category.save();
  res.status(201).json(category);
};

const updateCategory = async (req = request, res = response) => {
  const id = { _id: req.params.id };
  const { state, name, ...args } = req.body;

  args.name = name.toUpperCase();
  args.user = req.user._id;

  const category = await Category.findByIdAndUpdate(id, args);
  category.name = args.name;

  res.json(category);
};

const deleteCategory = async (req, res = response) => {
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );

  res.json(category);
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};

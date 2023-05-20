const { respone } = require("express");
const Product = require("../models/product");
const { body } = require("express-validator");

const getProducts = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("user", "name")
      .populate("category", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    products,
  });
};

const getProduct = async (req, res = response) => {
  const { id } = req.params;
  const query = { _id: id };

  const product = await Product.find(query)
    .populate("user", "name")
    .populate("category", "name");

  res.json(product);
};

const createProduct = async (req, res = response) => {
  const name = req.body.name.toUpperCase();
  const { state, user, ...args } = req.body;
  const productDB = await Product.findOne({ name });

  if (productDB) {
    return res.status(400).json({
      msg: `El producto ${productDB.name} ya existe`,
    });
  }

  const data = {
    ...args,
    name,
    user: req.user._id,
  };

  const product = new Product(data);
  await product.save();
  res.status(201).json(product);
};

const updateProduct = async (req, res = response) => {
  const id = { _id: req.params.id };
  const { state, user, ...args } = req.body;

  if (args.name) {
    args.name = args.name.toUpperCase();
  }
  args.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, args);

  res.json({ product });
};

const deleteProduct = async (req, res = response) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );

  res.json(product);
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};

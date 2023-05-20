const Category = require("../models/category");
const Product = require("../models/product");
const Role = require("../models/role");
const User = require("../models/user");

const isValidRole = async (role = "") => {
  const existRole = await Role.findOne({ role });
  if (!existRole) {
    throw new Error(`El rol ${role} no esta registrado en la BD`);
  }
};

const existEmail = async (email = "") => {
  const exist = await User.findOne({ email });
  if (exist) {
    throw new Error(`Email already exists`);
  }
};

const userExistsById = async (id) => {
  const exist = await User.findOne({ _id: id });
  if (exist) {
    throw new Error(`El id no existe ${id}`);
  }
};

const categoryExistsById = async (id) => {
  const exist = await Category.findOne({ _id: id });
  if (!exist) {
    throw new Error(`El id no existe ${id}`);
  }
};

const productExistsById = async (id) => {
  const exist = await Product.findOne({ _id: id });
  if (!exist) {
    throw new Error(`El id no existe ${id}`);
  }
};

module.exports = {
  isValidRole,
  existEmail,
  userExistsById,
  categoryExistsById,
  productExistsById,
};

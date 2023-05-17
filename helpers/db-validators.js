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
  const exist = await User.findOne(id);
  if (exist) {
    throw new Error(`El id no existe ${id}`);
  }
};

module.exports = {
  isValidRole,
  existEmail,
  userExistsById,
};

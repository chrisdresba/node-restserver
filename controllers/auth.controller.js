const { response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({ email });
    //check exist user
    if (!usuario) {
      return res
        .status(400)
        .json({ msg: "Usuario / password no son correctos" });
    }
    //check state
    if (!usuario.state) {
      return res.status(400).json({ msg: "Usuario inactivo" });
    }

    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ msg: "Usuario / password no son correctos" });
    }

    const token = await generateJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error, contactar al administrador" });
  }
};
module.exports = {
  login,
};

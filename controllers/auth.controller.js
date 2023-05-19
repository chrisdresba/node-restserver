const { response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    //check exist user
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Usuario / password no son correctos" });
    }
    //check state
    if (!user.state) {
      return res.status(400).json({ msg: "Usuario inactivo" });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ msg: "Usuario / password no son correctos" });
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error, contactar al administrador" });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, email, img } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      //create user
      const data = {
        name,
        email,
        password: "x",
        img,
        google: true,
        role: "USER_ROLE",
      };

      user = new User(data);
      await user.save();
    }

    if (!user.state) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    //generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token de google no es valido",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};

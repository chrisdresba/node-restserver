const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { uploadFileHelper } = require("../helpers/uploadFile");
const User = require("../models/user");
const Product = require("../models/product");

const uploadFile = async (req, res = response) => {
  try {
    const path = await uploadFileHelper(req.files, undefined, "imgs");
    res.json({
      msg: "Archivo subido correctamente",
      path,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const updateImage = async (req, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "usuarios":
      model = await User.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case "productos":
      model = await Product.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }
      break;

    default:
      res.status(500).json({ msg: "Se me olvidó validar esto" });
      break;
  }

  if (model.img) {
    const pathImg = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  const name = await uploadFileHelper(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json({
    model,
  });
};

const updateImageCloudinary = async (req, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "usuarios":
      model = await User.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case "productos":
      model = await Product.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }
      break;

    default:
      res.status(500).json({ msg: "Se me olvidó validar esto" });
      break;
  }

  if (model.img) {
    const nameArr = model.img.split("/");
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;

  await model.save();

  res.json({
    model,
  });
};

const showImage = async (req, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "usuarios":
      model = await User.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case "productos":
      model = await Product.findById(id);
      if (!model) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }

      break;
    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  if (model.img) {
    const pathImg = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }

  if (model.img) {
    const pathImg = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }

  const pathImgError = path.join(__dirname, "../assets/no-image.jpg");
  return res.sendFile(pathImgError);
};

module.exports = {
  uploadFile,
  updateImage,
  updateImageCloudinary,
  showImage,
};

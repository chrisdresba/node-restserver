const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { response } = require("express");

const uploadFileHelper = (
  files,
  validExtension = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const cutName = archivo.name.split(".");
    const extension = cutName[cutName.length - 1];

    if (!validExtension.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida, las permitidas son ${validExtension}`
      );
    }

    const tempName = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, tempName);

    archivo.mv(uploadPath, function (err) {
      if (err) {
        return reject(err);
      }

      resolve(tempName);
    });
  });
};

module.exports = {
  uploadFileHelper,
};

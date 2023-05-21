const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const {
  uploadFile,
  updateImage,
  showImage,
  updateImageCloudinary,
} = require("../controllers/uploads.controller");
const { validCollections } = require("../helpers/db-validators");
const { validateFile } = require("../middlewares/validate-file");

const router = Router();

router.post("/", validateFile, uploadFile);

router.put(
  "/:collection/:id",
  [
    validateFile,
    check("id", "El ID no es válido").isMongoId(),
    check("collection").custom((c) =>
      validCollections(c, ["usuarios", "productos"])
    ),
    validateFields,
  ],
  updateImageCloudinary
  //updateImage
);

router.get(
  "/:collection/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    check("collection").custom((c) =>
      validCollections(c, ["usuarios", "productos"])
    ),
    validateFields,
  ],
  showImage
);

module.exports = router;

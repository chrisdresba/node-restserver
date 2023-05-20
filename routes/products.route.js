const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");
const { productExistsById } = require("../helpers/db-validators");
const { isAdminRole } = require("../middlewares/validate-role");

const router = Router();

router.get("/", getProducts);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(productExistsById),
    validateFields,
  ],
  getProduct
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("category", "No es un ID válido").isMongoId(),
    validateFields,
  ],
  createProduct
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(productExistsById),
    validateFields,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(productExistsById),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;

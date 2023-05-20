const { Router } = require("express");
const { check } = require("express-validator");
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller");
const { categoryExistsById } = require("../helpers/db-validators");
const { isAdminRole } = require("../middlewares/validate-role");

const router = Router();

router.get("/", getCategories);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(categoryExistsById),
    validateFields,
  ],
  getCategory
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields,
  ],
  createCategory
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(categoryExistsById),
    validateFields,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(categoryExistsById),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;

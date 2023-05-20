const { Router } = require("express");
const { check } = require("express-validator");

const {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
} = require("../controllers/user.controller");

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { isAdminRole, hasRole } = require("../middlewares/validate-role");

const {
  isValidRole,
  existEmail,
  userExistsById,
} = require("../helpers/db-validators");

const router = Router();

router.get("/", usersGet);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(userExistsById),
    validateFields,
  ],
  usersPut
);

router.post(
  "/",
  [
    check("email", "El correo no es valido").isEmail(),
    check("email").custom(existEmail),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe de ser mas de 6 letras").isLength({
      min: 6,
    }),
    check("role").custom(isValidRole),
    validateFields,
  ],
  usersPost
);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(userExistsById),
    check("role").custom(isValidRole),
    validateFields,
  ],
  usersPut
);

router.delete(
  "/:id",
  [
    validateJWT,
    // isAdminRole,
    hasRole("ADMIN_ROLE", "SALES_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(userExistsById),
    validateFields,
  ],
  usersDelete
);

module.exports = router;

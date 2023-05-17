const { Router } = require("express");

const {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
} = require("../controllers/user.controller");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const {
  isValidRole,
  existEmail,
  userExistsById,
} = require("../helpers/db-validators");

const router = Router();

router.get("/", usersGet);

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
  [check("id", "No es un ID válido").isMongoId(), validateFields],
  check("id").custom(userExistsById),
  check("role").custom(isValidRole),
  usersPut
);

router.delete(
  "/:id",
  check("id", "No es un ID válido").isMongoId(),
  check("id").custom(userExistsById),
  usersDelete
);

module.exports = router;

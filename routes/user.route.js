const { Router } = require("express");

const {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
  usersPatch,
} = require("../controllers/user.controller");

const router = Router();

router.get("/", usersGet);

router.post("/", usersPost);

router.put("/:id", usersPut);

router.patch("/", usersPatch);

router.delete("/:id", usersDelete);

module.exports = router;

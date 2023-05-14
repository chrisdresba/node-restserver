const { response, request } = require("express");

const usersGet = (req = request, res = response) => {
  const { q, name = "No name", apikey } = req.query;

  res.json({
    msg: "get API - controller",
    q,
    name,
    apikey,
  });
};

const usersPost = (req = request, res = response) => {
  const { name, age } = req.body;

  res.json({
    msg: "post API - controller",
    name,
    age,
  });
};

const usersPut = (req = request, res = response) => {
  const { id } = req.params;

  res.json({
    msg: "put API - controller",
    id,
  });
};

const usersPatch = (req = request, res = response) => {
  res.json({
    msg: "patch API - controller",
  });
};

const usersDelete = (req = request, res = response) => {
  const { id } = req.params;
  res.json({
    msg: "delete API - controller",
    id,
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
};

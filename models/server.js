const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.userPath = "/api/usuarios";

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json());

    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.userPath, require("../routes/user.route"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Example app listening on port", this.port);
    });
  }
}
module.exports = Server;

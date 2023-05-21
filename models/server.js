const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;

    this.paths = {
      auth: "/api/auth",
      categories: "/api/categorias",
      products: "/api/productos",
      search: "/api/buscar",
      uploads: "/api/uploads",
      users: "/api/usuarios",
    };

    //Connect to DB
    this.connectDB();
    //Middlewares
    this.middlewares();
    //Routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json());

    this.app.use(express.static("public"));

    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth.route"));
    this.app.use(this.paths.categories, require("../routes/categories.route"));
    this.app.use(this.paths.products, require("../routes/products.route"));
    this.app.use(this.paths.search, require("../routes/search.route"));
    this.app.use(this.paths.uploads, require("../routes/uploads.route"));
    this.app.use(this.paths.users, require("../routes/user.route"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Example app listening on port", this.port);
    });
  }
}
module.exports = Server;

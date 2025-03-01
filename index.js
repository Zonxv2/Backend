const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const ProductModel = require("./models/product.models");
const CartModel = require("./models/cart.model");
const productsRouter = require("./routes/products.router");
app.use("/products", productsRouter);
const cartsRouter = require("./routes/carts.router");
app.use("/api/carts", cartsRouter);
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars.engine({ defaultLayout: false }));
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

const MONGO_URL = "mongodb://localhost:27017/";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("¡Hola Mundo! Esta es la página principal.");
});

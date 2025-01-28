const express = require("express");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

const app = express();
const PORT = 8080;

app.use(express.json());

app.use("/api/products", productsRouter);

app.listen(8080, () => console.log("Servidor corriendo en el puerto 8080"));

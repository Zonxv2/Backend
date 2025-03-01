const express = require("express");
const ProductModel = require("../models/product.models");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    let query = {};
    if (req.query.query) {
      try {
        query = JSON.parse(req.query.query);
      } catch (error) {
        query = { nombre: { $regex: req.query.query, $options: "i" } };
      }
    }
    const sort =
      req.query.sort === "asc"
        ? { precio: 1 }
        : req.query.sort === "desc"
        ? { precio: -1 }
        : {};

    const options = {
      page: page,
      limit: limit,
      sort: sort,
      lean: true,
    };

    const result = await ProductModel.paginate(query, options);

    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/products?page=${result.prevPage}&limit=${limit}&sort=${
            req.query.sort
          }&query=${encodeURIComponent(JSON.stringify(query))}`
        : null,
      nextLink: result.hasNextPage
        ? `/products?page=${result.nextPage}&limit=${limit}&sort=${
            req.query.sort
          }&query=${encodeURIComponent(JSON.stringify(query))}`
        : null,
    };

    res.render("products/index", response);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid);
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Producto no encontrado" });
    }
    res.send({ status: "success", payload: product });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Inicio de la ruta POST /products"); // <-- Agregado
    console.log("Datos recibidos:", req.body); // <-- Agregado
    const product = new ProductModel(req.body);
    console.log("Producto creado:", product); // <-- Agregado
    console.log("Intentando guardar producto en la base de datos..."); // <-- Agregado
    await product.save();
    console.log("Producto guardado:", product); // <-- Agregado
    console.log("Producto guardado exitosamente"); // <-- Agregado
    res.status(201).send({ status: "success", payload: product });
  } catch (error) {
    console.error("Error en la ruta POST /products:", error); // <-- Agregado
    res.status(500).send({ status: "error", message: error.message });
  } finally {
    console.log("Fin de la ruta POST /products"); // <-- Agregado
  }
});
router.put("/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Producto no encontrado" });
    }
    res.send({ status: "success", payload: product });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.pid);
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Producto no encontrado" });
    }
    res.send({ status: "success", message: "Producto eliminado" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

module.exports = router;

const express = require("express");
const CartModel = require("../models/cart.model");
const ProductModel = require("../models/product.models");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const cart = new CartModel();
    await cart.save();
    res.status(201).send({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate(
      "productos.producto"
    );
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Carrito no encontrado" });
    }
    res.send({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Carrito no encontrado" });
    }

    cart.productos = cart.productos.filter(
      (item) => item.producto.toString() !== req.params.pid
    );
    await cart.save();

    res.send({ status: "success", message: "Producto eliminado del carrito" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Carrito no encontrado" });
    }
    cart.productos = req.body;
    await cart.save();

    res.send({ status: "success", message: "Carrito actualizado" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Carrito no encontrado" });
    }

    const productIndex = cart.productos.findIndex(
      (item) => item.producto.toString() === req.params.pid
    );
    if (productIndex === -1) {
      return res.status(404).send({
        status: "error",
        message: "Producto no encontrado en el carrito",
      });
    }

    cart.productos[productIndex].cantidad = req.body.cantidad;
    await cart.save();

    res.send({
      status: "success",
      message: "Cantidad de producto actualizada",
    });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Carrito no encontrado" });
    }

    cart.productos = [];
    await cart.save();

    res.send({
      status: "success",
      message: "Todos los productos eliminados del carrito",
    });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

module.exports = router;

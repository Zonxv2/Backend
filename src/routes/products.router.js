// routes/products.router.js

const { Router } = require("express");
const fs = require("fs").promises;
const path = require("path");

const router = Router();
const productsFilePath = path.join(__dirname, "../data/productos.json");

// Función para leer productos del archivo
const readProducts = async () => {
  try {
    const data = await fs.readFile(productsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // Si el archivo no existe, devolvemos un array vacío
      return [];
    } else {
      throw error;
    }
  }
};

// Función para escribir productos al archivo
const writeProducts = async (products) => {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error al escribir en el archivo de productos:", error);
  }
};

// Función para generar un ID único
const generateId = () => {
  return Date.now().toString(); // Usamos la marca de tiempo como ID único
};

// 1. GET /api/products - Listar todos los productos
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await readProducts();

    if (limit) {
      return res.json(products.slice(0, parseInt(limit)));
    }

    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// 2. GET /api/products/:pid - Obtener un producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await readProducts();
    const product = products.find((p) => p.id === pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// 3. POST /api/products - Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;

    // Validación de campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newProduct = {
      id: generateId(),
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails: thumbnails || [],
      status: true,
    };

    const products = await readProducts();
    products.push(newProduct);
    await writeProducts(products);

    res
      .status(201)
      .json({ message: "Producto agregado exitosamente", product: newProduct });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// 4. PUT /api/products/:pid - Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = req.body;

    const products = await readProducts();
    const productIndex = products.findIndex((p) => p.id === pid);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const product = products[productIndex];

    // No permitimos actualizar el ID
    const updatedProduct = { ...product, ...updatedFields, id: product.id };
    products[productIndex] = updatedProduct;

    await writeProducts(products);

    res.json({
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// 5. DELETE /api/products/:pid - Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const products = await readProducts();
    const filteredProducts = products.filter((p) => p.id !== pid);

    if (products.length === filteredProducts.length) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await writeProducts(filteredProducts);

    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;

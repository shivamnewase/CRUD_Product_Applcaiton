var Product = require("../models/products.model");

exports.addProduct = async (req, res) => {
  try {
    const { name, price, brand, isActive, location, visiblearea } = req.body; // extract product data from request body
    const product = new Product({
      name,
      price,
      brand,
      isActive,
      location,
      visiblearea,
    }); // create new Product instance with data

    // Save product to database
    const savedProduct = await product.save();

    // Return success message and saved product data
    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    // Handle any errors that occur during database operation
    res.status(500).json({ error: error.message });
  }
};

exports.findAllProduct = async (req, res) => {
  // Retrieve and return all product from the database.
  try {
    let products = await Product.find(); // Find all products in the database
    res.status(200).json(products); // Return the products in JSON format
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// get all active products
exports.getActiveProduct = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProductBeforeActive = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const updatedProduct = req.body;

    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      updatedProduct
    );

    res.status(200).json({
      message: "Product updated successfully before activation",
      product: updateProduct,
    });
  } catch (error) {
    next(getActiveProduct);
  }
};

exports.search = (req, res) => {
  // Extract the query parameters from the request URL
  const { name, brand, location } = req.query;

  // Build the search query based on the provided parameters
  const searchQuery = {};
  if (name) searchQuery.name = { $regex: new RegExp(name, "i") };
  if (brand) searchQuery.brand = { $regex: new RegExp(brand, "i") };
  if (location) searchQuery.location = { $regex: new RegExp(location, "i") };

  // Execute the search query on the database
  Product.find(searchQuery, (err, products) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      res.send(products);
    }
  });
};

exports.findOne = function (req, res) {
  // Find a single product with a productId
  Product.findById(req.params.productId, function (err, data) {
    if (err) {
      res
        .status(500)
        .send({
          message: "Could not retrieve product with id " + req.params.productId,
        });
    } else {
      res.send(data);
    }
  });
};

exports.purchaseProduct = async (req, res) => {
  const productId = req.params.productId;
  const quantity = req.body.quantity;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    product.stock -= quantity;
    await product.save();

    return res.json({ message: "Purchase successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

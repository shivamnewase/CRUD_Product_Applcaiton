module.exports = function (app) {
  var products = require("../controllers/products.controller");

  // Create a new product
  app.post("/product", products.addProduct);

  // Retrieve all product
  app.get("/product", products.findAllProduct);

  // check all active product
  app.get("/activeProduct", products.getActiveProduct);

  //Update product before active
  app.get("/update/:id", products.updateProductBeforeActive);

  //search api by product name and brand filter or location filter
  app.get("/search", products.search);

  // // Retrieve a single product with productId
  app.get("/product/:productId", products.findOne);

  // // Update a product with noteId
  app.post("/product/:productId", products.purchaseProduct);
};

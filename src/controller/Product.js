const productModel = require("../models/product");

const addedProduct = async (req, res) => {
  try {
    console.log("I am inside add product data");
    // console.log(req.body);
    // console.log("this is req.body", req.body);
    const { name, price, quantity, createdAt } = req.body;
    if (name == "" || price == "" || quantity == "" || createdAt == "") {
      var required = "Please fill all fields marked as (*) mandatory";
      res.render("addProduct.ejs", {
        mandatory: required,
      });
    } else {
      var mydata = new productModel({
        name,
        price,
        quantity,
        createdAt,
      });

      await productModel.create(mydata, function (err, user) {
        if (err) {
          console.log(err);
        } else {
          // console.log(mydata);
          res.redirect("http://localhost:8010/api/v1/admin/adminDashboard/:1");
        }
      });
    }
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    console.log("hi i am inside delete product");
    const product = req.params.slug;
    //   console.log(product);
    await productModel.findOneAndDelete({ slug: product }, function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("http://localhost:8010/api/v1/admin/adminDashboard/:1");
      }
    });
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = req.params.slug;
    // console.log(product);
    const productdata = await productModel.findOne({ slug: product });
    res.render("updateProduct.ejs", {
      currentProduct: productdata,
    });
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

const updatedProduct = async (req, res) => {
  try {
    console.log("inside updated product data");

    const product = req.params.slug;

    const productdata = await productModel.findOne({ slug: product });
    const { name, price, quantity, createdAt } = req.body;

    var newProductData = {
      name: name || productdata.name,
      price: price || productdata.price,
      quantity: quantity || productdata.quantity,
      createdAt: createdAt || productdata.createdAt,
    };
    await productModel.updateOne(
      { slug: product },
      newProductData,
      function (err) {
        if (err) console.log("error");
        // console.log("success");
        else {
          console.log("success");
          res.redirect("http://localhost:8010/api/v1/admin/adminDashboard/:1");
        }
      }
    );
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};
module.exports = { addedProduct, deleteProduct, updateProduct, updatedProduct };

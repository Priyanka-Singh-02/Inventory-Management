
const bcrypt = require("bcrypt");

const adminModel = require("../models/admin");
const userModel = require("../models/user");
const productModel = require("../models/product");




const homePage = async (req, res) => {
  try {
    req.flash('info', 'Flash is back!')
    res.render("index.ejs", {
      notFound:"",
      emailerr: " ",
      passworderr: " ",
    });
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

//login admin
const login = async (req, res) => {
  try {
    var flag = 0;

    const { email, password } = req.body;
   console.log(req.body);
    var adminDetail = await adminModel.findOne({ email: email });
  // console.log(adminDetail.email)
    //   // console.log("admin deatails ", adminDetail);
    
   
    // var adminDetail = await adminModel.findOne({ email: email });
 console.log(adminDetail)
    if (email == "" && password == "") {
      var emailerr = "Please Enter Email";
      var passworderr = "Please Enter Password";
      console.log("please Enter Email");
      flag = 1;
    } else if (password == "" && email  !=="") {
      var passworderr = "Please Enter Password";
      console.log("please enter password");
      flag = 1;
    } else if (email == "" && password !== "") {
      flag = 1;
      var emailerr = "Please Enter Email";
    }
    if (flag == 1) {
      res.render("index.ejs", {
       
        emailerr: emailerr,
        passworderr: passworderr,
        notFound:"",
       
      });
    }
    // console.log(adminDetail)
    const isMatch = await bcrypt.compareSync(password, adminDetail.password);
    // console.log("ismatch", isMatch);
    if (isMatch) {
    
      res.redirect("http://localhost:8010/api/v1/admin/adminDashboard/:1");
    } else {
      res.render("index.ejs", {
      
        emailerr: "",
        passworderr: "wrong password ! ",
        notFound:"",
        
      });
    }
  // }
  // else
  // {
  //   res.render("index.ejs", {
  //     notFound: "no such account exist!",
  //     emailerr:"",
  //     passworderr:""
  //   });
  // }
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

//admin Dashboard */
const adminDashboard = async (req, res) => {
  try {

    var perPage = 2;
    var page = req.params.page || 1;
    const userdata = await userModel.find({});
   productModel.find({}) .skip((perPage * page) - perPage)
    .limit(perPage) .exec(function(err,products) {
      productModel.count().exec(function(err, count) {
          if (err) return next(err);
          else
          {
    res.render("dashbord.ejs", {
      users: userdata,
      success:req.flash('info'),
      products: products,
      current: page,
      pages: Math.ceil(count / perPage)
    });}})});
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

const addProduct = async (req, res) => {
  try {
    res.render("addProduct.ejs", {
      mandatory: "",
    });
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};
module.exports = { homePage, login, adminDashboard, addProduct };

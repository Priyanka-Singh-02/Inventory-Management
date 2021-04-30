const bcrypt = require("bcrypt");

const adminModel = require("../models/admin");
const userModel = require("../models/user");
const productModel = require("../models/product");

const homePage = async (req, res) => {
  try {
   
    res.render("index.ejs", {
      notFound: "",
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
let count = 0;
const login = async (req, res) => {
  try {
    var flag = 0;

    const { email, password } = req.body;
    console.log(req.body);
    var adminDetail = await adminModel.findOne({ email: email });
    // console.log(adminDetail.email)
    //   // console.log("admin deatails ", adminDetail);

    // var adminDetail = await adminModel.findOne({ email: email });
    console.log(adminDetail);
    if (email == "" && password == "") {
      var emailerr = "Please Enter Email";
      var passworderr = "Please Enter Password";
      console.log("please Enter Email");
      flag = 1;
    } else if (password == "" && email !== "") {
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
        notFound: "",
      });
    }
    // console.log(adminDetail)
    const isMatch = await bcrypt.compareSync(password, adminDetail.password);
    // console.log("ismatch", isMatch);
    if (isMatch) {
      count = 1;
      res.redirect("http://localhost:8010/api/v1/admin/adminDashboard");
    } else {
      res.render("index.ejs", {
        emailerr: "",
        passworderr: "wrong password ! ",
        notFound: "",
        
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
// console.log(count);
    const userdata = await userModel.find({}).count();
    const productdata = await productModel.find({}).count();
    if(count ==1)
    {
    req.flash("info", "You are logged in successfully");
    
    res.render("dashbord.ejs", {
      totalUsers: userdata,
      totalProducts: productdata,
      flash: req.flash('info') ,
    });
    count++;
  }
  else
  {
    res.render("dashbord.ejs", {
      totalUsers: userdata,
      totalProducts: productdata,
      flash: " "
  });}
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

const viewUsers = async (req, res) => {
  try {

    var perPage = 4;
    var page = req.params.page || 1;
    // const userdata = await userModel.find({});
    // const productdata = await productModel.find({}).count();
    userModel.find({}) .skip((perPage * page) - perPage)
    .limit(perPage) .exec(function(err,userdata) {
     userModel.count().exec(function(err, count) {
          if (err) return next(err);
          else
          {
    res.render("viewUsers.ejs", {
      users: userdata,
      noUserFound:"",
      current: page,
      pages: Math.ceil(count / perPage)
    });}})});
    // res.render("viewUsers.ejs", {
    //   users: userdata,
    //   noUserFound: "",
    //   //  totalProducts:productdata
    // });
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

const viewProducts = async (req, res) => {
  try {
    // const userdata = await userModel.find({});
    // const productdata = await productModel.find({});
    var perPage = 2;
    var page = req.params.page || 1;
    // const userdata = await userModel.find({});
    // const productdata = await productModel.find({}).count();
    productModel.find({}) .skip((perPage * page) - perPage)
    .limit(perPage) .exec(function(err,productdata) {
    productModel.count().exec(function(err, count) {
          if (err) return next(err);
          else
          {
    res.render("viewProducts.ejs",
    {
      products:productdata,
      current: page,
      pages:Math.ceil(count / perPage),
      noProductFound:"",
    });
  }})});
}
    //  users: userdata,
    //  totalProducts:productdata
   catch (error) {
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


const searchUser = async (req, res) => {
  try {
    const searchValue = req.body.search;
    // console.log(searchValue,"searchValue");
    if (searchValue === "") {
      res.redirect("http://localhost:8010/api/v1/admin/viewUsers/:1");
    } else {
      const regexSearch = "^" + searchValue;

      //===== doubt =====//
      // var data = await userModel.find({name: { $regex: searchValue,$options : "i" } },{} )
      //   var data = await userModel.find({$or: [
      //       {name:{$regex:regexSearch,$options:"i"}},   {title:{$regex:searchValue,$options:'i'}}
      //   ] },{} )
      //=====***============/
      const userdata = await userModel.find({});
      var data = await userModel.find({
        name: { $regex: regexSearch, $options: "i" },
      });
      console.log(data, "data");

      if (data == "") {
        res.render("viewUsers.ejs", {
          users: data,
          noUserFound: "No such user is found",
          pages:0,
          current:0,
          //  totalProducts:productdata
        });
      }
      if (data != " ") {
        res.render("viewUsers.ejs", {
          users: data,
          noUserFound: "",
          pages:1,
          current:1,
          //  totalProducts:productdata
        });
      }
    }
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

const searchProduct = async (req, res) => {
  try {
    const searchValue = req.body.search;
    // console.log(searchValue,"searchValue");
    if (searchValue === "") {
      res.redirect("http://localhost:8010/api/v1/admin/viewProducts/:1");
    } else {
      const regexSearch = "^" + searchValue;

      //===== doubt =====//
      // var data = await userModel.find({name: { $regex: searchValue,$options : "i" } },{} )
      //   var data = await userModel.find({$or: [
      //       {name:{$regex:regexSearch,$options:"i"}},   {title:{$regex:searchValue,$options:'i'}}
      //   ] },{} )
      //=====***============/
      const productdata = await productModel.find({});
      var data = await productModel.find({
        name: { $regex: regexSearch, $options: "i" },
      });
      // console.log(data, "data");

      if (data == "") {
        res.render("viewProducts.ejs", {
          products: data,
          noProductFound: "No such product is found",
          pages:0,
          current:0,
          //  totalProducts:productdata
        });
      }
      if (data != " ") {
        res.render("viewProducts.ejs", {
          products: data,
         
          pages:1,
          current:1,
          noProductFound:"",
          //  totalProducts:productdata
        });
      }
    }
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
}; 

const manageProducts = async(req,res) => {
try {
  const productdata = await productModel.find({});
  res.render("manageProducts.ejs", {
    mandatory: "",
    products:productdata,
  });
} catch (error) {
  res.render("adminError.ejs");
  console.log("unexpected error occured");
  console.log(error);
}
};

module.exports = {
  homePage,
  login,
  adminDashboard,
  addProduct,
  viewUsers,
  viewProducts,
  searchUser,
  viewProducts,
  searchProduct,
  manageProducts
};

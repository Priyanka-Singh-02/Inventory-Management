
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
    
      res.redirect("http://localhost:8010/api/v1/admin/adminDashboard");
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
    const userdata = await userModel.find({}).count();
    const productdata = await productModel.find({}).count();
    res.render("dashbord.ejs", {
     totalUsers: userdata,
     totalProducts:productdata
    });;
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};


const viewUsers = async  (req, res) => {
  try {
    const userdata = await userModel.find({});
    // const productdata = await productModel.find({}).count();
    res.render("viewUsers.ejs", {
     users: userdata,
     noUserFound : "",
    //  totalProducts:productdata
    });;
  } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};




const viewProducts = async  (req, res) => {
  try {
    // const userdata = await userModel.find({});
    // const productdata = await productModel.find({}).count();
    res.render("viewProducts.ejs");
    //  users: userdata,
    //  totalProducts:productdata
   
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


const searchUser = async (req, res) => {
  try {
    const searchValue = req.body.search;
    // console.log(searchValue,"searchValue");
    if(searchValue==="")
    {
      res.redirect("http://localhost:8010/api/v1/admin/viewUsers")
    }
    else
    {
    const regexSearch = "^"+searchValue
    
    //===== doubt =====//
    // var data = await userModel.find({name: { $regex: searchValue,$options : "i" } },{} )
  //   var data = await userModel.find({$or: [
  //       {name:{$regex:regexSearch,$options:"i"}},   {title:{$regex:searchValue,$options:'i'}}
  //   ] },{} )
  //=====***============/
  const userdata = await userModel.find({});
  var data = await userModel.find({name: { $regex: regexSearch,$options : "i" } } )
    console.log(data,"data");
    
    if(data == "")
    {
      res.render("viewUsers.ejs", {
        users: userdata,
        noUserFound:"No such user is found"
       //  totalProducts:productdata
       });;
      }
       if(data != " ")
        {
        res.render("viewUsers.ejs", {
          users: data,
          noUserFound:""
         //  totalProducts:productdata
         });;
       }
  
  }
 } catch (error) {
    res.render("adminError.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }

};

module.exports = { homePage, login, adminDashboard, addProduct,viewUsers,viewProducts,searchUser};

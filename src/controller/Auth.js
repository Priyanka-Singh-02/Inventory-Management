const bcrypt = require("bcrypt");

const userModel = require("../models/user");
const productModel = require("../models/product");

// let email="";

//show user details by admin
const homePage = async (req, res) => {
  try {
    console.log("I am inside homepage");
    res.render("userIndex.ejs");
  } catch (error) {
    res.render("unExpected.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};
const signUp = async (req, res) => {
  try {
    console.log("I am inside signup");
    res.render("userSignUp.ejs", { alreadyExist: "", mandatory: "" });
  } catch (error) {
    res.render("unExpected.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};
const signUpData = async (req, res) => {
  try {
    var flag = 0;
    console.log("I am inside signup data");

    const {
      name,
      email,
      gender,
      country,
      state,
      city,
      password,
      profilePhoto,
    } = req.body;
    console.log("this is req.body", req.body);

    if (
      name == "" ||
      email == "" ||
      gender == "" ||
      country == "" ||
      state == "" ||
      city == "" ||
      password == ""
    ) {
      var required = "Please fill all fields marked as (*) mandatory";
      flag = 1;
    }

    if (flag == 1) {
      res.render("userSignUp.ejs", {
        mandatory: required,
        alreadyExist: "",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      let hashedPassword = bcrypt.hashSync(password, salt);

      const userdata = await userModel.findOne({ email: email });
      console.log(userdata, "userdata");
      let profileImage = req.files;
      // console.log(profileImage);
      if (!userdata && profileImage[0] !== undefined) {
        var mydata = new userModel({
          name,
          password: hashedPassword,
          email,
          gender,
          country,
          state,
          city,
          profilePhoto: profileImage[0].filename,
        });
      } else if (!userdata) {
        var mydata = new userModel({
          name,
          password: hashedPassword,
          email,
          gender,
          country,
          state,
          city,
        });
      } else {
        res.render("userSignUp.ejs", {
          alreadyExist:
            "user already exist, kindly go back and try loggin in !",
          mandatory: "",
        });
      }

      await userModel.create(mydata, function (err, user) {
        if (err) {
          console.log(err);
        } else {
          console.log(mydata);
          res.redirect("http://localhost:8010/api/v1/auth/login");
        }
      });
    }
  } catch (error) {
    res.render("unExpected.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    res.render("userLogin.ejs", {
     
      emailerr: " ",
      passworderr: " ",
      notFound: " ",
    });
  } catch (error) {
    res.render("unExpected.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

let userEmail = "";
const loginData = async (req, res) => {
  try {
    var flag = 0;

    const { email, password } = req.body;
    var response = {
      email: email,
      password: password,
    };
    const userdata = await userModel.find({});
  const productdata = await productModel.find({});      
    if (email == "" && password == "") {
      var emailerr = "Please Enter Email";
      var passworderr = "Please Enter Password";
      console.log("please Enter Email");
      flag = 1;
    }  else if (password == "" && email !=="") {
      var passworderr = "Please Enter Password";
      console.log("please enter password");
      flag = 1;
    } else if (email == "" && password!=="") {
      flag = 1;
      var emailerr = "Please Enter Email";
    }
    if (flag == 1) {
      res.render("userLogin.ejs", {
        
        emailerr: emailerr || " ",
        passworderr: passworderr || " ",
        notFound: " ",
      });
    }

    // console.log("ismatch", isMatch);
    for (let i = 0; i < userdata.length; i++) {
     
      const match = await bcrypt.compare(password,userdata[i].password);
      if (email === userdata[i].email && match) {
        userEmail = userdata[i].email;
        // console.log(userdata[i].profilePhoto,"user profile image");
        res.render("userDashboard.ejs", {
          name: userdata[i].name,
          email: userdata[i].email,
          gender: userdata[i].gender,
          state: userdata[i].state,
          city: userdata[i].city,
          country: userdata[i].country,
          profile: userdata[i].profilePhoto,
          products:productdata
        });
        break;
      }
    }
    res.render("userLogin.ejs", {
      notFound: "user not found !",
     
      emailerr: emailerr || " ",
      passworderr: passworderr || " ",
    });
  } catch (error) {
    res.render("unExpected.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

const updateData = async (req, res) => {
  try {
    res.render("updateUserData.ejs", {
      mandatory: "",
      userMatch: " ",
    });
  } catch (error) {
    res.render("unExpected.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

const updatedData = async (req, res) => {
  try {
    console.log("inside updated data");
    // req.body email with the email constant, if same, then continue else render back to same page to enter correct email
    console.log(userEmail, "this is the logged in user");
    const email = req.body.email;
    if (email === "") {
      res.render("updateUserData.ejs", {
        mandatory: "please fill this (*) mandatory field",
        userMatch: " ",
      });
    } else {
      if (email === userEmail) {
        const userdata = await userModel.findOne({ email: email });
        const productdata = await productModel.find({});
        let newProfile = req.files;
        // console.log(newProfile);
        if (newProfile[0] !== undefined) {
          var myNewData = {
            name: req.body.name || userdata.name,
            gender: req.body.gender || userdata.email,
            city: req.body.city || userdata.city,
            state: req.body.state || userdata.state,
            country: req.body.country || userdata.country,
            profilePhoto: newProfile[0].filename,
          };
          await userModel.updateOne(
            { email: email },
            myNewData,
            function (err) {
              if (err) console.log("error");
              // console.log("success");
            }
          );
        } else {
          var myNewData = {
            name: req.body.name || userdata.name,
            gender: req.body.gender || userdata.email,
            city: req.body.city || userdata.city,
            state: req.body.state || userdata.state,
            country: req.body.country || userdata.country,
            // profilePhoto: profileImage[0].filename
          };
          await userModel.updateOne(
            { email: email },
            myNewData,
            function (err) {
              if (err) console.log("error");
              // console.log("success");
            }
          );
        }

        const newUserdata = await userModel.findOne({ email: email });
        // console.log(newUserdata,"this is new data of user")
        res.render("userDashboard.ejs", {
          name: newUserdata.name,
          email: newUserdata.email,
          gender: newUserdata.gender,
          state: newUserdata.state,
          city: newUserdata.city,
          country: newUserdata.country,
          profile: newUserdata.profilePhoto,
          products:productdata,
        });
      } else {
        res.render("updateUserData.ejs", {
          userMatch: "incorrect email",
          mandatory: "",
        });
      }
    }
  } catch (error) {
    res.render("unExpected.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

const updatePass = async (req, res) => {
  try {
    res.render("updateUserPassword.ejs", {
      mandatory: "",
      email: userEmail,
    });
  } catch (error) {
    res.render("unExpected.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

const updatedPass = async (req, res) => {
  try {
    console.log("inside updated pass");

    const email = req.params.email;

    const userdata = await userModel.findOne({ email: email });

    const { password, changedPassword, confirmPassword } = req.body;

    if (password === changedPassword) {
      res.redirect("http://localhost:8010/api/v1/auth/updatePass");
    }
    let userdataPass = userdata.password;
    const match = await bcrypt.compare(password, userdataPass);
    if (match && changedPassword === confirmPassword) {
      const salt = await bcrypt.genSalt(10);

      let encrpytedPass = bcrypt.hashSync(changedPassword, salt);

      var newPass = {
        password: encrpytedPass,
      };
      await userModel.updateOne({ email: email }, newPass, function (err) {
        if (err) console.log("error");
        // console.log("success");
        else {
          res.redirect("http://localhost:8010/api/v1/auth/login");
        }
      });
    } else {
    }
  } catch (error) {
    res.render("unExpected.ejs");
    console.log("unexpected error occured");
    console.log(error);
  }
};

module.exports = {
  homePage,
  signUp,
  signUpData,
  login,
  loginData,
  updateData,
  updatedData,
  updatePass,
  updatedPass,
};

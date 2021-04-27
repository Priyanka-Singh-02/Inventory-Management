const bcrypt = require("bcrypt");

const adminModel = require("../models/admin");

const admin = async () => {

  const result = await adminModel.find({ email: "priyanka@gmail.com" });
  var password = "Priyanka247";
  const generateSalt = (length = 10) => bcrypt.genSaltSync(length);
  const encryptPassword = (password) => {
    const salt = generateSalt(10);
    return bcrypt.hashSync(password, salt);
  };
  if (result.length === 0) {
    await adminModel.create({
      firstName: "Priyanka",
      middleName: "Anil",
      lastName: "Singh",
      email: "priyanka@gmail.com",
      password: encryptPassword(password),
      gender: "Female",
    });
  }
 console.log(result)
}
module.exports = { admin };
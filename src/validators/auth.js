const { body } = require("express-validator");

// const loginValidation = [
//   body("email").not().isEmpty().trim().isEmail(),
//   body("password").not().isEmpty().trim().isString().isLength({ max: 15 }),
// ];

const Registration = [
  body("email")
    .notEmpty()
    .trim()
    .isEmail()
    .withMessage("email must include '@' and '.' "),
  body("password")
    .isLength({ max: 15 })
    .not()
    .isEmpty()
    .withMessage("password max length is 6 characters"),

  body("gender")
    .not()
    .isEmpty()
    .isIn(["Male", "Female", "Other"])
    .withMessage("choose valid gender: 'Male','Female','Other'"),
  body("age").not().isEmpty().isNumeric().withMessage("Age should be a number"),
  body("firstName")
    .not()
    .isEmpty()
    .isAlpha()
    .withMessage("first name should only contain alphabets"),
  body("lastName")
    .not()
    .isEmpty()
    .isAlpha()
    .withMessage("last name should only contain alphabets"),
];

module.exports = {
  Registration,
};

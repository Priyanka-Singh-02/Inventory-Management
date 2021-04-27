// const jwt = require("jsonwebtoken");

// const userModel = require("../models/user");
// const message = require("./constant");

// //module exports
// module.exports = async (req, res, next) => {

//   try {
//     const token = req.header("Authorization");
//     console.log("authtoken =: ", token);
//     if (!token) return res.status(401).json({ message: message.AUTH_ERROR });
//     else {
//       const decoded = jwt.verify(token, "config.secret");
//       req.user = decoded.user
//       const user = await userModel.findById(req.user.id);
//       if (!user) {
//         return res.status(500).json({ error: message.USER_NOT_EXITS, });
//       }
//       return next();
//     }
//   } catch (e) {
//     console.error(e);
//     res.status(500).send({ message: message.INVALID_TOKEN });
//   }
// };



const config = require("config");
const jwt = require("jsonwebtoken");
const { accessToken } = config.get("jwt");
const User = require("../users/usersModel");


module.exports = (req, res, next) => {
    try {
      console.log(req.cookies.token,"token")
      jwt.verify(
        req.cookies.token,
        accessToken.secretKey,
        async function (err, decoded) {
          if (err) {
            console.log(err)
            return res.status(401).json({
              status: false,
              message: "Unauthorised request",
            });
          } else {
            console.log(decoded);
            req.userData = await User.findById(decoded.userId).select("_id first_name last_name email is_active role")
            next();
          }
        }
      );
    } catch (error) {
      res.status(401).json({
        status: false,
        error: "Invalid tokenId",
      });
    }
  };

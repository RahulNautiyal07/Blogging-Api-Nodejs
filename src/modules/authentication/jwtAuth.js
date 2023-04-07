const { verifyAccessToken } = require("../common/jwtToken");
const User = require("../users/usersModel");


module.exports = async (req, res, next) => {
    try {
      let token = req.cookies.token;
      let decode = await verifyAccessToken(token);
      console.log(decode,"user token")
      if(!decode) throw new Error("Invalid Token");
      let userData = await User.findById(decode.userId).select("_id first_name last_name email is_active role");
      if(!userData) throw new Error("Invalid User request")
      req.userData = userData
      next();
    } catch (error) {
      res.status(401).json({
        status: false,
        result: error.message
      });
    }
  };

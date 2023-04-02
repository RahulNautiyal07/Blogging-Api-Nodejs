const User = require("./usersModel");
const bcrypt = require("bcryptjs");
const { checkEmail, findUser } = require("./usersQueries");
const { generateAccessToken } = require("../common/jwtToken");
const jwt = require("jsonwebtoken");
const config = require("config");
const logger = require("../../../logger");


const { salt } = config.get("bcrypt");

const setCookie = (res,token) => {
 return res.cookie("token", token,{
    secure: process.env.NODE_ENV !== "developement",
    httpOnly: true,
    // set cookie life for 10 days
    maxAge: 864000000,
  });
}

const signUp = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    if (first_name && last_name && email && password) {
      if (await checkEmail(email)) throw new Error("Email already exist");
      let newPassword = await bcrypt.hash(password, salt);
      let newUser = await new User({
        first_name,
        last_name,
        email,
        password: newPassword,
        role
      }).save();

      const payload = { userId: newUser._id};
      const token = await generateAccessToken(payload);
      setCookie(res,token);
      res.status(201).json({ status: true, data: newUser, accessToken: token });
    } else
      res.status(200).json({ status: false, error: "Something is missing" });
  } catch (e) {
    logger.error(e.message)
    res.status(200).json({ status: false, error: e.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email })
    console.log(user)
    if (!user) throw new Error("This email is not exists");
    let doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) throw new Error("Email and Password is not correct");
    const payload = { userId: user._id };
    const token = await generateAccessToken(payload);
    setCookie(res,token);
    res.status(200).json({ status: true, user: user, token: token });
  } catch (e) {
    logger.error(e.message)
    res.status(401).json({ status: false, message: e.message });
  }
};

const getAllUsers = async (req, res) => {
  try {

    if(req.userData.role =='admin'){
    // let users = await User.find().select(
    //   "_id email first_name last_name is_active role"
    // );
    // if (users) res.status(200).json({ status: true, result: users });
    // else throw new Error("Please create users");
    if(res.paginatedData) res.status(200).json(res.paginatedData)
    else throw new Error("Please create users");
    } else throw new Error("Authorization failed.")
  } catch (e) {
    res.status(200).json({ status: false, result: e.message });
  }
};

module.exports = { signUp, signIn, getAllUsers };

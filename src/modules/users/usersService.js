const User = require("./usersModel");
const bcrypt = require("bcryptjs");
const { checkEmail, findUser } = require("./usersQueries");
const client = require('../../db/redis_init');

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../common/jwtToken");
const jwt = require("jsonwebtoken");
const config = require("config");
const logger = require("../../../logger");

const { salt } = config.get("bcrypt");

const setCookie = (res, key, value, expiryTime) => {
  return res.cookie(key, value, {
    secure: process.env.NODE_ENV !== "developement",
    httpOnly: true,
    // set cookie life for 10 days
    maxAge: expiryTime,
    // 864000000,
  });
};

//signUp callback
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
        role,
      }).save();

      const payload = { userId: newUser._id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);
      setCookie(res, "token", accessToken, 1000 * 60 * 5);
      setCookie(res, "refreshToken", refreshToken, 1000 * 60 * 60 * 24 * 30);
      res
        .status(201)
        .json({ status: true, data: newUser, accessToken, refreshToken });
    } else
      res.status(400).json({ status: false, error: "Something is missing" });
  } catch (e) {
    logger.error(e.message);
    res.status(200).json({ status: false, error: e.message });
  }
};

// login callback
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) throw new Error("This email is not exists");
    let doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) throw new Error("Email and Password is not correct");
    const payload = { userId: user._id };
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);
    setCookie(res, "token", accessToken, 1000 * 60 * 5);
    setCookie(res, "refreshToken", refreshToken, 1000 * 60 * 60 * 24 * 30);
    res
      .status(200)
      .json({ status: true, user: user, accessToken, refreshToken });
  } catch (e) {
    logger.error(e);
    res.status(401).json({ status: false, message: e.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (req.userData.role == "admin") {
      // let users = await User.find().select(
      //   "_id email first_name last_name is_active role"
      // );
      // if (users) res.status(200).json({ status: true, result: users });
      // else throw new Error("Please create users");
      if (res.paginatedData) res.status(200).json(res.paginatedData);
      else throw new Error("Please create users");
    } else throw new Error("Authorization failed.");
  } catch (e) {
    res.status(200).json({ status: false, result: e.message });
  }
};

const searchUser = async (req, res) => {
  try {
    let searchText = req.query.search;
    if (!searchText || searchText.length <= 5)
      throw new Error(
        "No result found try with different search parameter, And make sure you are passing search in params like this ?search='abcd'"
      );
    let filter = { $text: { $search: `\"${searchText}\"` } };
    let users = await User.find(filter).select(
      "_id email first_name last_name is_active role"
    );
    if (users) res.status(200).json({ status: true, result: users });
    else throw new Error("No users found.");
  } catch (e) {
    res.status(200).json({ status: false, result: e.message });
  }
};

const changeRole = async (req, res) => {
  const id = req.params.id;
  const role = req.query.role.toString();
  console.log(role, "role", id);

  try {
    let user_id = req.userData._id;
    if (!role || (role !== "admin" && role !== "user"))
      throw new Error(
        "Data is missing Or you have entered role wrongly, Please pass like this ex: url?role=user or url?role=admin, After changing the role please login again!. "
      );
    let user = await User.findById(id);
    if (!user) throw new Error("User not found");
    if (!user_id.equals(user._id) && req.userData.role !== "admin")
      throw new Error("You are not Authorised");
    let updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: { role: role } }
    );
    if (updatedUser)
      res.status(200).json({
        status: true,
        result: updatedUser,
        message: "Role changed successfully, please login again!",
      });
    else throw new Error("Failed to update.");
  } catch (e) {
    res.status(200).json({ status: false, result: e.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    let refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new Error("Refresh token is missing.");
    const userId = await verifyRefreshToken(refreshToken);
    const payload = { userId: userId };
    const accessToken = await generateAccessToken(payload);
    const refToken = await generateRefreshToken(payload);
     setCookie(res, "token", accessToken, 1000 * 60 * 5);
     setCookie(res, "refreshToken", refToken, 1000 * 60 * 60 * 24 * 30);
    res
      .status(200)
      .json({ status: true, accessToken: accessToken, refreshToken: refToken });
  } catch (e) {
    res.status(200).json({ status: false, result: e.message });
  }
};

const logout = async (req, res, next) => {
  try {
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error("Refresh token is missing.");
    const userId = await verifyRefreshToken(refreshToken);
    client.connect();
    client.del(userId).then((result) => {
      if(!result) throw new Error("Token not found")
      res.status(200).json({ status: true, result: "Logout successfully!" });
    })
    client.quit();
  } catch (e) {
    res.status(200).json({ status: false, result: e.message });
  }
}

module.exports = {
  signUp,
  signIn,
  getAllUsers,
  searchUser,
  changeRole,
  refreshToken,
  logout,
};

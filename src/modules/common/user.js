const User = require("../users/usersModel");

const createUser = (userData, type) => {};

const findUserById = async (userId) => {
  return await User.findById(userId);
};

// const findUserByIdAndUpdate = async (userId) =>{
//     let user = await User.findById(userId);

// }

const checkEmail = async (email) => {
  let user = await User.findOne({ email });
  return user;
  ;
};



module.exports = {checkEmail}
const User = require("../users/usersModel");

const createUser = async ({ first_name, last_name, email, newPassword }) => {
  let newUser = new User({
    first_name,
    last_name,
    email,
    newPassword,
  });
  newUser.save();
  return newUser;
};

const findUserById = async (userId) => {
  return await User.findById(userId);
};

const findUser = async (data) => {
  if (typeof data !== object) throw new Error("Invalid data type");
  let user = await User.findOne(data);
    if(!user){
        throw new Error("User is not present in DB");
    }
    return user;
};

// const  = async (data) => {
//     if(typeof data !== object) throw new Error("Invalid data type");
//     return await User.findById(data);
// };

// const findUserByIdAndUpdate = async (userId) =>{
//     let user = await User.findById(userId);

// }

const checkEmail = async (email) => {
  if (!email) throw new Error("Email is missing.");
  let user = await User.findOne({ email });
    if(!user){
        return false;
    } else {
        return true;
    }
};

module.exports = { checkEmail, findUser };

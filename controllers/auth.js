import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  const existing_user_email = await User.findOne({ email: req.body.email });
  const existing_username = await User.findOne({ username: req.body.username });
  if (existing_user_email)
    return res.status(200).json({
      status: 400,
      message: "Email already exist",
    });
  if (existing_username)
    return res.status(200).json({
      status: 400,
      message: `Username '${req.body.username}' already exists`,
    });

  const salt = await bcrypt.genSalt(10);
  const hash_password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hash_password,
    role: req.body.role,
  });

  try {
    const savedUser = await user.save();
    return res.status(200).json({
      status: 200,
      message: "User Created Successfully",
      payload: savedUser,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err,
    });
  }
};

// const signin = async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user)
//     return res.status(200).json({
//       status: 404,
//       message: "Email is not found",
//     });

//   const validatedPassword = await bcrypt.compare(
//     req.body.password,
//     user.password
//   );
//   if (validatedPassword) {
//     const token = jwt.sign(
//       { _id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "365d",
//       }
//     );
//     const { _id, username, firstName, lastName, email, role } = user;
//     res.status(200).json({
//       status: 200,
//       payload: {
//         token: token,
//         _id,
//         username,
//         firstName,
//         lastName,
//         email,
//         role,
//       },
//     });
//   } else {
//     return res.status(200).json({
//       status: 404,
//       message: "Password is wrong",
//     });
//   }
// };

export { signup };
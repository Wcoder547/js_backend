import { AsyncHandler } from "../utils/AsyncHandler.js";

const userRegister = AsyncHandler(async (req, res) => {
  //   res.status(200).json({
  //     message: "ok",
  //   });
  //Methods we are going to follow in userRegister controller
  //first-we take the input from the user
  //second- validation
  //check if the user is already exsists -if user exsists then send to the signin page
  //check the images - check for avatar
  //upload them into cloudinary
  //create user object -- save into db
  //remove password and refresh token from the response
  // check for user creation
  //return response

  const { fullname, username, email, password } = req.body;
  console.log(email);
});

export default userRegister;

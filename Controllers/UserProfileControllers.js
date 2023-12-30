const asynchandler = require("express-async-handler");
const UserDetails = require("../model/UserProfileModel");
const fast2sms = require("fast-two-sms");
// const otpGenerator = require("otp-generator");
// const accountSid = 'AC001e412a3e164f40c815ad6dbc382bbb';
// const authToken = 'c21a4abe6ddda8394c2c13f064df1ada';
// const twilioPhoneNumber = '9140727824';
// const client = require('twilio')(accountSid, authToken);

// const otpMap = new Map();

// const sendOTP = asynchandler(async (req, res) => {
//   const { number } = req.body;

//   const userExists = await UserDetails.findOne({ number });

//   if (!userExists) {
//     // User not found
//     res.status(404);
//     throw new Error("User not found");
//   }

//   // Generate and store OTP (you might want to save it in the database for verification)
//   const generatedOTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
//   userExists.storedOTP = generatedOTP;
//   await userExists.save();

//   try {
//     // Send OTP via Twilio
//     await client.messages.create({
//       body: `Your OTP is: ${generatedOTP}`,
//       from: twilioPhoneNumber,
//       to: `+${number}`,
//     });

//     res.status(200).json({ message: 'OTP sent successfully' });
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     res.status(500).json({ message: 'Failed to send OTP' });
//   }
//   // Send the OTP to the user (in production, you'd use a messaging service or other means)
//   // console.log(`Sending OTP to ${number}: ${generatedOTP}`);

//   res.status(200).json({ message: "OTP sent successfully" });
// });

const registerUser = asynchandler(async (req, res) => {
  const { name, number, password } = req.body;

  if (!name || !number || !password) {
    res.status(400);
    throw new Error("Please enter all the details");
  }

  // const storedOtp = otpGenerator.generate(6, {
  //   upperCase: false,
  //   specialChars: false,
  //   alphabets: false,
  // });

  // otpMap.set(number, storedOtp);

  // if (enteredOtp !== storedOtp) {
  //   otpMap.delete(number);

  //   return res.status(400).json({ message: "Invalid Otp" });
  // }

  // const isValidOTP = verifyOTP(enteredOtp, storedOTP);
  // if (!isValidOTP) {
  //   return res.status(400).json({ message: "Invalid OTP" });
  // }

  const userExists = await UserDetails.findOne({ number });
  if (userExists) {
    res.status(400);
    // return res.status(400).json({ error: 'User with this phone number already exists.' });
    // otpMap.delete(number);

    throw new Error("user already exists");
    //return res.status(400).json({ message: 'User with this phone number already exists.' });
    //res.send("user already exists");
  }

  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  var phoneotp = generateOTP();
  console.log("Generated OTP:", phoneotp);

  const otpExpirationTime = new Date(Date.now() + 1 * 60 * 1000);

  const userData = await UserDetails.create({
    name,
    number,
    password,
    otp: phoneotp,
    otpExpiration: otpExpirationTime,
    isVerified: false,
  });

  if (userData) {
    //OTP
    var options = {
      authorization:
        "KyHirObxvTPpzR6hmuea3qlAo7YFUsn9gSc51WM0DjELtXBZJG3IERbCpXNAs6DagVH4BMdPTuFhGvZe",
      message: `hey bro  this is the code ${phoneotp}`,
      numbers: [number],
    };
    fast2sms
      .sendMessage(options)
      .then((response) => {
        console.log("Message Sent:", response);
      })
      .catch((error) => {
        console.log("Error Occurred:", error);
      });

    res.status(201).json({
      _id: userData._id,
      name: userData.name,
      number: userData.number,
      password: userData.password,
      otp: phoneotp,
      // otpExpiration:otpExpirationTime,
    });
    console.log("Baan gya");
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
    // console.log("nahi bna");
  }
});

//otp verify
const verify = asynchandler(async (req, res) => {
  const { number, otp } = req.body;
  // const userEnteredOtp = req.body.otp;
  const Database = await UserDetails.findOne({ number });

  if (Database && Database.otp === otp) {
    if (new Date() > Database.otpExpiration) {
      console.log("Time is over");
    } else {
      console.log("Otp is right");
    await  UserDetails.findOneAndUpdate({number},{isVerified:true})

     // Database.isVerified == true;
      
    }
  } else {
    console.log("not matched");
  }
});

//Login
const authUser = asynchandler(async (req, res) => {
  const { number, password } = req.body;
  const userData = await UserDetails.findOne({ number });
 if (userData.isVerified===true){
  if (userData && userData.password === password) {
    res.json({
      _id: userData._id,
      name: userData.name,
      number: userData.number,
    });
    console.log("Login ho gya dost");
    res.status(400).json({ message: "Login ho gya dost" });
  }else{
    res.status(400).json({ message: "You verified" });
  }
}
  else{
    console.log("User is not verified")
    res.status(400).json({ message: "you are verified" });
  }
  
  //console.log("Login nahi hua")
});

const getUserProfile = asynchandler(async (req, res) => {
  const { number } = req.params; // Use req.params to get the route parameter

  try {
    const user = await UserDetails.findOne({ number });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const removefromCart = asynchandler(async (req, res) => {
  try {
    const { number } = req.params;

    const itemIdToRemove = req.params._id;
    console.log("this is id", req.params._id);
    console.log("here is something");

    const user = await UserDetails.findOne({ number });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const removedItem = user.cart.find(
      (item) => item._id.toString() === itemIdToRemove.toString()
    );
    user.cart = user.cart.filter(
      (item) => item._id.toString() !== itemIdToRemove.toString()
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: removedItem,
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message,
    });
  }
});

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  removefromCart,
  verify,
};

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

  let phoneotp;
  let otpExpirationTime;

  const userExists = await UserDetails.findOne({ number });

  if (!userExists) {
    function generateOTP() {
      return Math.floor(1000 + Math.random() * 9000);
    }
    phoneotp = generateOTP();
    console.log("Generated OTP createuser:", phoneotp);

    otpExpirationTime = new Date(Date.now() + 2 * 60 * 1000);

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
     console.log("nahi bna");
    }
  }

  if (userExists) {
    if (userExists.isVerified) {
      console.log("User with this phone number already exists.");
      // res.status(400);
      // return res.status(400).json({ error: "User with this phone number already exists." });
        return res.status(200).json({ message: "Number already exists" });
    } else {
      function generateOTP() {
        return Math.floor(1000 + Math.random() * 9000);
      }
      phoneotp = generateOTP();
      console.log("Generated OTP:", phoneotp);

      otpExpirationTime = new Date(Date.now() + 2 * 60 * 1000);

      const updatedUser = await UserDetails.findOneAndUpdate(
        { number, isVerified: false },
        {
          $set: {
            name,
            password,
            otp: phoneotp,
            otpExpiration: otpExpirationTime,
            isVerified: false,
          },
        },
        { new: true }
      );
      if (updatedUser) {
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
            _id: updatedUser._id,
            name: updatedUser.name,
            number: updatedUser.number,
            password: updatedUser.password,
            otp: phoneotp,
            // otpExpiration:otpExpirationTime,
          });
      }
      console.log("You can register");
      // console.log(phoneotp, otpExpirationTime);
    }
  } else {
    console.log("You can register");
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
      return res.status(400).json({ error: "OTP expired" });
    } else {
      console.log("Otp is right");
      await UserDetails.findOneAndUpdate({ number }, { isVerified: true });
      return res.status(200).json({ message: "OTP verified successfully" });

      // Database.isVerified == true;
    }
  } else {
    console.log("not matched");
    return res.status(400).json({ error: "OTP mismatch" });
  }
});

const ResendOtp = asynchandler(async (req, res) => {
  const { number, otp } = req.body;

  const otpExpirationTime = new Date(Date.now() + 2 * 60 * 1000);

  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  var newphoneotp = generateOTP();
  console.log("new Generated OTP:", newphoneotp);

  var options = {
    authorization:
      "KyHirObxvTPpzR6hmuea3qlAo7YFUsn9gSc51WM0DjELtXBZJG3IERbCpXNAs6DagVH4BMdPTuFhGvZe",
    message: `hey bro  this is the code ${newphoneotp}`,
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

  const Database = await UserDetails.findOneAndUpdate(
    { number },
    { otp: newphoneotp, otpExpiration: otpExpirationTime },
    { new: true }
  );
  return res.status(200).json({ message: "Otp is resended" });
  // if (Database && Database.otp === otp) {
  //   if (new Date() > Database.otpExpiration) {
  //     console.log("Time is over");
  //   } else {
  //     console.log("Otp is right");
  //   await  UserDetails.findOneAndUpdate({number},{isVerified:true})

  //    // Database.isVerified == true;
  //   }
  // } else {
  //   console.log("not matched");
  // }
});

const ForgotPassword = asynchandler(async (req, res) => {
  const { number, otp } = req.body;
  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
  }
  var newphoneotp = generateOTP();
  console.log("new Generated OTP:", newphoneotp);

  var options = {
    authorization:
      "KyHirObxvTPpzR6hmuea3qlAo7YFUsn9gSc51WM0DjELtXBZJG3IERbCpXNAs6DagVH4BMdPTuFhGvZe",
    message: `hey bro  this is the code ${newphoneotp}`,
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

  const userData = await UserDetails.findOneAndUpdate(
    { number },
    { otp: newphoneotp },
    { new: true }
  );
  if (userData) {
    return res.status(200).json({ message: "OTP verification code send" });
  }
});

const ChangePassword = asynchandler(async (req, res) => {
  const { number, password, otp } = req.body;
  const Database = await UserDetails.findOne({ number });
  const otpExpirationTime = new Date(Date.now() + 2 * 60 * 1000);

  if (Database && Database.otp === otp) {
    if (new Date() > Database.otpExpiration) {
      const userData = await UserDetails.findOneAndUpdate(
        { number },
        { password },
        { new: true }
      );
    } else {
      console.log("Time gone");
    }
    return res.status(200).json({ message: "Password changed successfully" });
  }
});

// const ChangePassword = asynchandler(async (req, res) => {
//   const { number, password } = req.body;

//   // Validate the password (you can add more validation logic as required)
//   if (!password) {
//     return res.status(400).json({ success: false, message: 'Password is required' });
//   }

//   try {
//     // Find the user by number and update the password directly
//     const userData = await UserDetails.findOneAndUpdate(
//       { number },
//       { password }, // Update with plain-text password
//       { new: true } // Return the updated document
//     );

//     if (!userData) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // Send a success message or the updated user data back
//     res.status(200).json({ success: true, message: 'Password updated successfully', user: userData });
//   } catch (error) {
//     // Handle any errors that occur during the update process
//     console.error(error.message);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// });

//Login

const authUser = asynchandler(async (req, res) => {
  const { number, password } = req.body;
  const userData = await UserDetails.findOne({ number });
  if (userData.isVerified === true) {
    if (userData && userData.password === password) {
      res.json({
        _id: userData._id,
        name: userData.name,
        number: userData.number,
      });
      console.log("Login ho gya dost");
      res.status(400).json({ message: "Login ho gya dost" });
    } else {
      res.status(400).json({ message: "Wrong password" });
    }
  } else {
    console.log("User is not verified");
    res.status(200).json({ message: "you are verified" });
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
  ResendOtp,
  ForgotPassword,
  ChangePassword,
};

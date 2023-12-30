const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const path = require("path");
// const fast2sms = require("fast-two-sms");

const Userprofile = require("./routes/Userprofile");
const Usercart = require("./routes/Usercart");
const Userbuynow = require("./routes/Userbuynow");
const Directorders = require("./routes/DirectOrders");
const Dashboard = require("./routes/Dashboard");

dotenv.config();
connectDB();

app.use(express.json());
app.use(express.static("public"));
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors());

app.get("/", (req, res) => {
  res.send("Express this side");
});

app.use(express.urlencoded({ extended: false }));

app.use("/api/userprofile", Userprofile);
app.use("/api/user", Usercart);
app.use("/api/user", Userbuynow);
app.use("/api/shopping", Directorders);
app.use("/api/Dashboard", Dashboard);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// function generateOTP() {
//   return Math.floor(1000 + Math.random() * 9000);
// }

// var otp = generateOTP();
// console.log("Generated OTP:", otp);

// var options = {
//   authorization:
//     "KyHirObxvTPpzR6hmuea3qlAo7YFUsn9gSc51WM0DjELtXBZJG3IERbCpXNAs6DagVH4BMdPTuFhGvZe",
//   message: `hey bro  this is the code ${otp}`,
//   // numbers: ["9120278724"],
// };
// fast2sms
//   .sendMessage(options)
//   .then((response) => {
//     console.log("Message Sent:", response);
//   })
//   .catch((error) => {
//     console.log("Error Occurred:", error);
//   });

//  console.log(otp);

const PORT = process.env.PORT || 5000;
app.listen(5000, console.log(`port number is ${PORT}`));

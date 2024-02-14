const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const path = require("path");
const { MongoClient } = require("mongodb");
// const fast2sms = require("fast-two-sms");

const Usercart = require("./routes/Usercart");
const Dashboard = require("./routes/Dashboard");
const AddDishes = require("./routes/AddDishes")
// const Userprofile = require("./routes/Userprofile");
// const Userbuynow = require("./routes/Userbuynow");
// const Directorders = require("./routes/DirectOrders");

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

app.use("/api/menu", Usercart);
app.use("/api/menu/AddDishes", AddDishes);
app.use("/api/Dashboard", Dashboard);

// app.use("/api/userprofile", Userprofile);
// app.use("/api/user", Userbuynow);
// app.use("/api/shopping", Directorders);

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

// const uri =
//   "mongodb+srv://CramoxclubStore:CramoxclubStoreadmin@cluster0.7a4yjfb.mongodb.net/?retryWrites=true&w=majority"; // Update with your MongoDB connection string
// const databaseName = "test";
// const collectionName = "directorders"; // Update with your actual collection name

// app.get("/api/printUserProfiles", async (req, res) => {
//   try {
//     const client = new MongoClient(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await client.connect();
//     const database = client.db(databaseName);
//     const collection = database.collection(collectionName);
//     const userProfiles = await collection.find().toArray();
//     res.json(userProfiles);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// const CartdatabaseName = "test";
// const CartcollectionName = "buynows"; // Update with your actual collection name

// app.get("/api/printUserCartData", async (req, res) => {
//   try {
//     const client = new MongoClient(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await client.connect();
//     const database = client.db(CartdatabaseName);
//     const collection = database.collection(CartcollectionName);
//     const userProfiles = await collection.find().toArray();
//     res.json(userProfiles);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(5000, console.log(`port number is ${PORT}`));

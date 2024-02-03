const express = require("express");
const app = express();

//Importing  All the Routes.
const userRoutes = require("./routes/User");

const profileRoutes = require("./routes/Profile");

const paymentRoutes = require("./routes/Payment");

const courseRoutes = require('./routes/Courses');

const contactUsRoute = require("./routes/Contact");


//import the dataBase
const database = require("./config/database");
//cookieparser 
const cookieParser = require("cookie-parser");

//backend and Frontent to run simaltenously on a localmachine we need cors
const cors = require("cors");

//middleware for parsing the files & imported the function named cloudinaryConnect
const cloudinary = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const dotenv = require("dotenv");
dotenv.config();
//Define the Port
const PORT = process.env.PORT || 4000;

//database connect
database.connectwithDb();

//middlewares
//middleware to Parse json request body
app.use(express.json());


//middleware to Parse cookie-Parser
app.use(cookieParser());

app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)

app.use(
    fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

//cloudinary connection
cloudinary.cloudinaryConnect();

//mounting the api routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
 app.use("/api/v1/reach", contactUsRoute);

//default Route
app.use("/",(req,res) =>{
    return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

//start server
app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
});

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {config} = require("dotenv");
const AuthRoute = require("./routers/AuthRoute");

const app = express();
config();

app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true 
})); 

app.use(cookieParser());
app.use(express.json());



app.use("/api", AuthRoute);

app.listen(2000, () => {
    console.log("Server started on port 2000");
});

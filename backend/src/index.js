const express = require("express");
const cors = require("cors");
const {config} = require("dotenv");

const app = express();
config();
 
const signupRoute = require("./routers/signupRoute");
app.use(cors()); 
app.use(express.json());


app.use("/api", signupRoute);

app.listen(2000, () => {
    console.log("Server started on port 2000");
});

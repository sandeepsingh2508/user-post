const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

//routes
const userAuthRoutes = require("./routes/auth");
const postDetailsRoutes = require("./routes/post");
//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/api/userauth", userAuthRoutes);
app.use("/api/post", postDetailsRoutes);

module.exports = app;

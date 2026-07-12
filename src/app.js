const express = require("express");
const cookieparser=require("cookie-parser")
const authroutes = require("../routes/authroutes");

const app = express();

// Parse JSON request bodies
app.use(express.json());
app.use(cookieparser())
// Parse URL-encoded form bodies
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authroutes);

module.exports = app;
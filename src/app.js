// import
const express = require("express");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const { error } = require("console");

// router import
const userRouter = require("./routers/user.router.js");
const authRouter = require("./routers/auth.router.js");
const productsRouter = require("./routers/products.router.js");

const app = express();
const port = 3003;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// router middleware
app.use("/api", [userRouter, authRouter, productsRouter]);

app.get("/", (req, res) => {
  res.send("Welcome");
});

// error middleware
app.use((err, req, res, next) => {
  res.status(error.status || 500);
  res.send(err.message || "에러 발생!");
});

app.listen(port, () => {
  console.log(port, "listening on port " + port);
});

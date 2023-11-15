// import
const express = require('express');
const cookieParser = require('cookie-parser');

// router import
const userRouter = require('./routers/user.router.js');
const authRouter = require('./routers/auth.router.js');
const productsRouter = require('./routers/products.router.js');

const app = express();
const port = 3003;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// router middleware
app.use('/api', [userRouter, authRouter, productsRouter]);

app.get('/', (req, res) => {
  res.send('Welcome');
});

app.listen(port, () => {
  console.log(port, 'listening on port ' + port);
});

//dotenv
require("dotenv").config();

//async errors

//server
const express = require("express");
const app = express();

//database
const connectDB = require("./db/connect"); //returns a promise, which is why the func it's consumed in is async

//routers
const productsRouter = require('./routes/products')

//error middleware
const notFoundMiddleWare = require("./middleware/not-found");
const errorMiddleWare = require("./middleware/error-handler");

//express middleware
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send('<h1>StoreAPI</h1><a href="/api/v1/products">Product Page</a>');
});

//base route
app.use('/api/v1/products', productsRouter)

//products route

//errors
app.use(notFoundMiddleWare);
app.use(errorMiddleWare);

//port variable
const port = process.env.PORT || 3000;

//connect to DB
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log("server is listening..."));
  } catch (err) {
    console.log(err);
  }
};

start();

console.log("04 Store API");

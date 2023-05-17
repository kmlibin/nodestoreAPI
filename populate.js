//dynamically add all values to database. connect to db, use model to auto add json products to db

//database
require("dotenv").config();
const connectDB = require("./db/connect");

//model
const Product = require("./models/product");

//access json product list
const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    //optional, deletes anything on there so you start from scratch
    await Product.deleteMany();
    await Product.create(jsonProducts);
    //we don't need to keep this file running, so exit..if error, exit with an error. 0 means everything went well. 1, error
    console.log("success");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();

//models import
const Product = require("../models/product");

//controllers
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort('name');
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {
  //mongoose 6+ automatically removes params that don't exist...can just pass in req.query to Product.find
  const { featured, company, name, sort } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    //mongo db query operators - looking for the pattern of name value, i flag means case insensitive. so, can type in e and get
    //anything with e in the name (as opposed to without regex, you'd be doing a hard search for the name of 'e', which doesn't exist)
    queryObject.name = { $regex: name, $options: "i" };
  }
  let result = Product.find(queryObject);
  if(sort) {
    //in postman it's set up where if you do multiple sorts, it's typed in as name,-price. we need name -price. ..but in postman i can write
    //it as the latter, so not entirely clear why this is necessary
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  }
  else {
    result = result.sort('createdAt')
  }
  const products = await result
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProductsStatic, getAllProducts };

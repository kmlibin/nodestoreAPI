//models import
const Product = require("../models/product");

//controllers
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).select("name price").limit(4);
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {
  //mongoose 6+ automatically removes params that don't exist...can just pass in req.query to Product.find
  //fields is made up - it's for the select method
  const { featured, company, name, sort, fields } = req.query;
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
  //check if sort param exists, then sort
  if (sort) {
    //in postman it's set up where if you do multiple sorts, it's typed in as name,-price. we need name -price. ..but in postman i can write
    //it as the latter, so not entirely clear why this is necessary
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  //check if fields param exists, then select method
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  //set up pagination
  //user passes in page, then multiply by the limit. so, for skip, user selects page 1, -1 = 0, ...essentially zero, means we skip zero items
  //page 2 - 2-1 times limit of 10 = 10, means you skip 10.
  //page / limit is what user passes in. access w req.query.page/limit
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1 ) * limit;
  result = result.skip(skip).limit(limit)

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProductsStatic, getAllProducts };

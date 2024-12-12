
const {merge} = require("lodash");
const ProductResolver=require('./products/productResolver');
const resolvers = merge({},
   ProductResolver,

);
module.exports = resolvers;
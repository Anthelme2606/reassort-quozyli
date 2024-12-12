const { gql } = require("graphql-tag");
const productTypes=require('./products/productType');
module.exports = gql`
${productTypes}
  
`;

const mock = require('../mock/mocks');
const email = require('../models/insertdata');
const userType = require('../server/auth/usertype');

const price = (price) => {
  if (price < 0 || NaN(price))
    return 422;
  return product.price = Math.trunc(product.price);  
}

module.exports = {
  price,
}

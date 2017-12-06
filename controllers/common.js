const mock = require('../mock/mocks');
const email = require('../models/insertdata');
const userType = require('../server/auth/usertype');

const price = (price) => {
  if (price < 0 || isNaN(price))
    return 422;
  return price = Math.trunc(price);
}

module.exports = {
  price,
}

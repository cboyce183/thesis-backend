const newCompany = require('../models/insertdata')
const randomCompany = require ('../mock/mocks');

module.exports = async function add (ctx) {
  console.log('random company', randomCompany);
  //const data = await newCompany.addCompany(randomCompany) //ctx.request.body
  ctx.status = 200;
}

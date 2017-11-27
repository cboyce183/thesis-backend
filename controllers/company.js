const newCompany = require('../models/insertdata')
const randomCompany = require ('../mock/mocks');

module.exports = async function add (ctx) {
  const data = await newCompany.addCompany(randomCompany.company) //ctx.request.body
  if (data)
    ctx.status = 201;
  else {
    ctx.body = 'This company already exists';
    ctx.status = 204; //Need to check which status set in this scenario
  }
}

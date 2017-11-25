const newCompany = require('../models/insertdata')
const randomCompany = require ('../mock/mocks');

module.exports = async function add (ctx) {
  const data = await newCompany.addCompany(randomCompany.company) //ctx.request.body
  if (data)
    ctx.status = 200;
  else
    ctx.body = 'This company already exist';
}

// module.exports = async function retrieve (ctx) {
//   const list = await newCompany.retrieveAll()
// }

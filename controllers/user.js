const setUser = require('../models/insertdata');
const randomUser = require('../mock/mocks');

module.exports = async function add (ctx) {
  const data = await setUser.addUser(randomUser.user) // to be replaced with ctx.request.body
  if (data)
    ctx.status = 200;
  else
    ctx.body = 'This user already exists';
}

// module.exports = async function edit (ctx) {
//   //const data = await setUser.editUser(); // to be replaced with ctx.request.body
//   ctx.status = 200;
// }

// module.exports = {
//   add: add,
//   edit: edit
// }

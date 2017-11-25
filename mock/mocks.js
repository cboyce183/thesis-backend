const faker = require('faker');

const company = {
  email:faker.internet.email(),
  password:faker.internet.password(),
  logo:faker.image.image(),
  name:faker.company.companyName(),
  weeklyAllow:faker.random.number(),
  coinName:'Zendama',
  isAdmin:faker.random.boolean()
}

module.exports = {
  company: company
}

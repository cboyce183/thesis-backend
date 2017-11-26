const faker = require('faker');

const company = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  logo: faker.image.image(),
  name: faker.company.companyName(),
  weeklyAllow: faker.random.number(),
  coinName: 'Zen',
  isAdmin: faker.random.boolean()
}

const user = {
  firstName: 'Paul',
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  hashkey: faker.random.number(),
  availableCurrency: faker.random.number(),
  receivedCurrency: faker.random.number(),
  company: 'Larson Group'
}

module.exports = {
  company: company,
  user: user
}

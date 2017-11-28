const faker = require('faker');

function company () {
  return {
    email: faker.internet.email(),
    password: 'hellocompany',
    logo: faker.image.image(),
    name: faker.company.companyName(),
    hashkey: faker.random.number(),
    weeklyAllow: faker.random.number(),
    coinName: 'Zen',
    isAdmin: true
  }
}

function user () {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'hellouser',
    hashkey: faker.random.number(),
    availableCurrency: faker.random.number(),
    receivedCurrency: faker.random.number(),
    company: 'Larson Group',
    isAdmin: false
  }
}
module.exports = {
  company: company,
  user: user
}

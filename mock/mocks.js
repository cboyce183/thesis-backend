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
    isAdmin: true,
    createdOn: 1511879017142
  }
}

function user () {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    profilePic: faker.image.imageUrl(),
    password: 'hellouser',
    hashkey: faker.random.number(),
    availableCurrency: faker.random.number(),
    receivedCurrency: faker.random.number(),
    company: 'Larson Group',
    isAdmin: false,
    createdOn: 1511879017142
  }
}

function editUser () {
  return {
    password: 'hellouseredited',
    profilePic: faker.image.imageUrl(),
    username: faker.internet.userName()
  }
}

module.exports = {
  company: company,
  user: user,
  editedUser: editUser
}

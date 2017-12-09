# thesis-backend
Thesis project backend - Koa - mongo - Hyperledger

## API

| Method | Where                 | Request                                  | Response                                 |
| ------ | --------------------- | ---------------------------------------- | ---------------------------------------- |
| POST   | Company Registry      | email, pswd, logo, name, wkly allow, coin name, isAdmin | 200/201                                  |
| GET    | Company Info          | headers / auth token + pswd              | all info from company                    |
| GET    | Log-In                | header, email + pswd                     | company + summary of all user info       |
| GET    | Tips                  | authorize requests                       | company usernames                        |
| PUT    | Tips                  | authorize requests, who, amount, why     | 200                                      |
| GET    | Ledger                | authorize requests                       | ledger - array                           |
| GET    | Catalog               | authorize requests                       | products, services                       |
| POST   | Catalog               | authorize requests, img,  name, value, isService,  if  (isService) => schedule | 201                                      |
| DELETE | Catalog               | authorize requests, products/services id | 200 x                                    |
| GET    | Settings/Manage Users | authorize requests                       | users summary                            |
| DELETE | Settings/Manage Users | authorize requests, user id              | 200 x                                    |
| POST   | Setting/Manage Users  | authorize requests, email                | send email to user with access code - return 200 |
| PUT    | Setting/Edit          | authorize requests, color, name, address, allowance, logo | 200                                      |
| PUT    | Give                  | authorize requests, who to, amount, why  | 200                                      |
| GET    | Wallet                | authorize requests                       | Ledger of user                           |
| PUT    | Catalog               | authorize requests, send id of product \|\| service, if (isService) => date | 200                                      |
| PUT    | User Settings         | authorize requests, name, display, profile img, what you are (e.g. position) | 200                                      |
|        |                       |                                          |                                          |


# thesis-backend
Thesis project backend - express &amp; cassandra

Jack, what did I tell you - never read the read me

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

## Blockchain specific notes
The framework being used is Hyperledger Fabric. Good luck, the documentation is longer than a song of ice and fire.

Some notes for my clarity, and for others:

# What we need the blockchain to actually do I guess

- Add orgs to blockchain
- Invalidate orgs that wanna leave
- Add peers to orgs
- Invalidate peers when they leave
- Perform transactions.

And thats it essentially. Add or remove peers + orgs, do some transactions with basic numbers. Like the hello freakin world of blockchain. Its late.

So to acheive this, when an org or user is created we need to store the private/public key pairs in the database.
Database may have to have a few documents, work it out later as a group.


# Cryptogen

Consumes crypto-config.yaml containing topography of the blockchain to generate a set of keys and certs for the organisations and the components belonging to those organisations. Each org is given a discreet ca-cert root cert binding the peers to the org. This mimics the concept that a unique member would provide its own cert authority to access && perform transactions, but instead allows the org to act as 'sub-chain' within the blockchain - having members of its own that other orgs cannot access.

Normal transactions and comms with Hyperledger Fabric are acheived via the standard private/public key method (afaik).

- "count" determines the number of peers per org.
- FYI nearly all the code below is in Go, not JavaScript.
- But some of it is in JavaScript lmao.
- naming convention for a network entity: "{{.hostname}}.{{.Domain}}"

Gotta use this to encrypt stuff.

## Process

# DevENV.init

command to kill idle containers:
  docker rm -f $(docker ps -aq)
  docker network prune

oh yeah u need docker too. Anywy

then: npm install (you know this one...)

to launch: ./startFabric.sh (except I think maybe replaced with some other name? not sure...)
 screw it https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html

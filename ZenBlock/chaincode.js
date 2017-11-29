// ====SMART CONTRACT CLIENT SIDE EXECUTION SAMPLES V://1.0.0 ==================

// ==== Invoke users ====
// peer chaincode invoke -C myc1 -n users -c '{"Args":["initUser","Charlie","0","0","null"]}'
// peer chaincode invoke -C myc1 -n users -c '{"Args":["initUser","Roberto","0","0","null"]}'   etc...
// peer chaincode invoke -C myc1 -n users -c '{"Args":["transferCash","Charlie","Roberto","50"]}'
// peer chaincode invoke -C myc1 -n users -c '{"Args":["delete","Charlie"]}'

// ==== Query users ====
// peer chaincode query -C myc1 -n users -c '{"Args":["readUser","Charlie"]}'
// peer chaincode query -C myc1 -n users -c '{"Args":["getUsersByRange","Charlie","Jack"]}'  --> Returns all users added between these two (inclusive)
// peer chaincode query -C myc1 -n users -c '{"Args":["getHistoryForUser","Charlie"]}'

// Rich Query (Only supported if CouchDB is used as state database):
//   peer chaincode query -C myc1 -n users -c '{"Args":["queryUsers","{\"selector\":{\"recipient\":\"Charlie\"}}"]}' ---> still working on this one

'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('=========== Instantiated Zendama Chaincode ===========');
    return shim.success();
  }

  async Invoke(stub) {
    console.info('Transaction ID: ' + stub.getTxID());
    console.info(util.format('Args: %j', stub.getArgs()));

    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.log('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params, this);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  // ===============================================
  // initUser - create a new user
  // ===============================================
  async initUser(stub, args, thisClass) {
    if (args.length != 4) {
      throw new Error('Incorrect number of arguments. Expecting 4');
    }
    // ==== Input sanitation ====
    console.info('--- start init user ---')
    if (args[0].lenth <= 0) {
      throw new Error('1st argument must be a non-empty string');
    }
    if (args[1].lenth <= 0) {
      throw new Error('2nd argument must be a non-empty string');
    }
    if (args[2].lenth <= 0) {
      throw new Error('3rd argument must be a non-empty string');
    }
    if (args[3].lenth <= 0) {
      throw new Error('4th argument must be a non-empty string');
    }
    let userName = args[0];
    let tokens = args[1].toLowerCase();
    let recipient = args[3].toLowerCase();
    let balance = parseInt(args[2]);

    // ==== Check if user already exists ====
    let userState = await stub.getState(userName);
    if (userState.toString()) {
      throw new Error('This user already exists: ' + userName);
    }

    // ==== Create user object and marshal to JSON ====
    let user = {};
    user.docType = 'user';
    user.name = userName;
    user.tokens = tokens;
    user.balance = balance;
    user.recipient = recipient;

    // === Save user to state ===
    await stub.putState(userName, Buffer.from(JSON.stringify(user)));
    let indexName = 'name'
    let nameIndexKey = await stub.createCompositeKey(indexName, [user.name]);
    console.info(nameIndexKey);
    //  Save index entry to state. Only the key name is needed, no need to store a duplicate copy of the user.
    //  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
    await stub.putState(nameIndexKey, Buffer.from('\u0000'));
    // ==== User saved and indexed. Return success ====
    console.info('- end init user');
  }

  // ===============================================
  // readUser - read a user from chaincode state
  // ===============================================
  async readUser(stub, args, thisClass) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting name of the user to query');
    }

    let name = args[0];
    if (!name) {
      throw new Error(' user name must not be empty');
    }
    let userAsbytes = await stub.getState(name); //get the user from chaincode state
    if (!userAsbytes.toString()) {
      let jsonResp = {};
      jsonResp.Error = 'User does not exist: ' + name;
      throw new Error(JSON.stringify(jsonResp));
    }
    console.info('=======================================');
    console.log(userAsbytes.toString());
    console.info('=======================================');
    return userAsbytes;
  }

  // ==================================================
  // delete - remove a user key/value pair from state
  // ==================================================
  async delete(stub, args, thisClass) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting name of the user to delete');
    }
    let userName = args[0];
    if (!userName) {
      throw new Error('user name must not be empty');
    }
    // to maintain the name index, we need to read the user
    let valAsbytes = await stub.getState(userName); //get the user from chaincode state
    let jsonResp = {};
    if (!valAsbytes) {
      jsonResp.error = 'user does not exist: ' + name;
      throw new Error(jsonResp);
    }
    let userJSON = {};
    try {
      userJSON = JSON.parse(valAsbytes.toString());
    } catch (err) {
      jsonResp = {};
      jsonResp.error = 'Failed to decode JSON of: ' + userName;
      throw new Error(jsonResp);
    }

    await stub.deleteState(userName); //remove the user from chaincode state

    // delete the index
    let indexName = 'name';
    let nameIndexKey = stub.createCompositeKey(indexName, [userJSON.name]);
    if (!nameIndexKey) {
      throw new Error(' Failed to create the createCompositeKey');
    }
    //  Delete index entry to state.
    await stub.deleteState(nameIndexKey);
  }

  // ===========================================================
  // transfer cash by setting a new recipient name on the user
  // ===========================================================
  //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-==-=-==-=-
  async transferCash(stub, args, thisClass) { // args: [user, recipient, money given]
    //   0       1
    // 'name', 'bob'
    if (args.length < 2) {
      throw new Error('Incorrect number of arguments. Expecting username and recipient')
    }

    let userName = args[0];
    let recipient = args[1].toLowerCase();
    console.info('- start transferCash ', userName, recipient);

    let userAsBytes = await stub.getState(userName);
    if (!userAsBytes || !userAsBytes.toString()) {
      throw new Error('user does not exist');
    }
    let userToTransfer = {};
    try {
      userToTransfer = JSON.parse(userAsBytes.toString()); //unmarshal
    } catch (err) {
      let jsonResp = {};
      jsonResp.error = 'Failed to decode JSON of: ' + userName;
      throw new Error(jsonResp);
    }
    console.info(userToTransfer);
    userToTransfer.recipient = recipient; //change the recipient

    let userJSONasBytes = Buffer.from(JSON.stringify(userToTransfer));
    await stub.putState(userName, userJSONasBytes); //rewrite the user

    console.info('- end transferCash (success)');
  }



  // // ===========================================================================================
  // // getUsersByRange performs a range query based on the start and end keys provided.
  //
  // // Read-only function results are not typically submitted to ordering. If the read-only
  // // results are submitted to ordering, or if the query is used in an update transaction
  // // and submitted to ordering, then the committing peers will re-execute to guarantee that
  // // result sets are stable between endorsement time and commit time. The transaction is
  // // invalidated by the committing peers if the result set has changed between endorsement
  // // time and commit time.
  // // Therefore, range queries are a safe option for performing update transactions based on query results.
  // // ===========================================================================================
  // async getUsersByRange(stub, args, thisClass) {
  //
  //   if (args.length < 2) {
  //     throw new Error('Incorrect number of arguments. Expecting 2');
  //   }
  //
  //   let startKey = args[0];
  //   let endKey = args[1];
  //
  //   let resultsIterator = await stub.getStateByRange(startKey, endKey);
  //   let method = thisClass['getAllResults'];
  //   let results = await method(resultsIterator, false);
  //
  //   return Buffer.from(JSON.stringify(results));
  // }

  // =========================================================================================
  // queryUsers uses a query string to perform a query for users.
  // Query string matching state database syntax is passed in and executed as is.
  // Supports ad hoc queries that can be defined at runtime by the client.
  // If this is not desired, follow the queryUsersForOwner example for parameterized queries.
  // Only available on state databases that support rich query (e.g. CouchDB)
  // =========================================================================================
  async queryUsers(stub, args, thisClass) {
    //   0
    // 'queryString'
    if (args.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting queryString');
    }
    let queryString = args[0];
    if (!queryString) {
      throw new Error('queryString must not be empty');
    }
    let method = thisClass['getQueryResultForQueryString'];
    let queryResults = await method(stub, queryString, thisClass);
    return queryResults;
  }

  async getAllResults(iterator, isHistory) {
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return allResults;
      }
    }
  }

  // =========================================================================================
  // getQueryResultForQueryString executes the passed in query string.
  // Result set is built and returned as a byte array containing the JSON results.
  // =========================================================================================
  async getQueryResultForQueryString(stub, queryString, thisClass) {

    console.info('- getQueryResultForQueryString queryString:\n' + queryString)
    let resultsIterator = await stub.getQueryResult(queryString);
    let method = thisClass['getAllResults'];

    let results = await method(resultsIterator, false);

    return Buffer.from(JSON.stringify(results));
  }

  async getHistoryForUser(stub, args, thisClass) {

    if (args.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting 1')
    }
    let userName = args[0];
    console.info('- start getHistoryForUser: %s\n', userName);

    let resultsIterator = await stub.getHistoryForKey(userName);
    let method = thisClass['getAllResults'];
    let results = await method(resultsIterator, true);

    return Buffer.from(JSON.stringify(results));
  }
};

shim.start(new Chaincode());

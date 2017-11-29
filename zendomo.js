const fetch = require('isomorphic-fetch');

// Welcome to Charlies house of blockchain^tm related fun.
// To use this library, require the file as 'const zendomo = require('PATH')' and use zendomo.methodName(args).
// Have fun.

// === create a user (when they sign up) ===
const createUser = async (id, firstName, lastName) => {
    const first = await fetch('http://192.168.0.35:3000/api/Trader', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            $class: "org.zendomo.biznet.Trader",
            tradeId: id,
            firstName: firstName,
            lastName: lastName,
            tokens: 0,
            credits: 0
        }),
        mode: 'cors'
    })
    .then( () => console.log('<------Sent to zendomo------>'));
}

// === get one user, filtered by id ===
const getOneUser = async (id) => {
    const result = await fetch('http://192.168.0.35:3000/api/Trader/' + id, {
        headers: {
            'Accept': 'application/json',
        },
        method: 'GET',
    })
    .then(res => res.json())
    .then(res => {return res});
    return result;
}

// === delete one user, filtered by id ===
const deleteOneUser = async (id) => {
    fetch('http://192.168.0.35:3000/api/Trader/' + id, {
        headers: {
            'Accept': 'application/json',
        },
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(res => console.log('<------Deleted user from zendomo------>\n', res));
}

// === edit one user, filtered by id ===
const editOneUser = async (id, firstName, lastName) => {
    fetch('http://192.168.0.35:3000/api/Trader/' + id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'            
        },
        method: 'PUT',
        credentials: 'same-origin',        
        body: JSON.stringify({
            $class: "org.zendomo.biznet.Trader",
            tradeId: id,
            firstName: firstName,
            lastName: lastName,
            tokens: 0,
            credits: 0
        })
    })
    .then(res => res.json())
    .then(res => console.log('<------Editted user from zendomo------>\n', res));
}

// === get all users (admin tool) ===
const getAllUsers = async () => {
    fetch('http://192.168.0.35:3000/api/Trader', {
        headers: {
            'Accept': 'application/json',
        },
        method: 'GET',
    })
    .then(res => res.json())
    .then(res => console.log('<------Users from zendomo------>\n', res));
}

// === transfer funds between users ===
const transferFunds = async (senderID, receiverID, ammount) => {
    const sender = await getOneUser(senderID);
    const receiver = await getOneUser(receiverID);
    const doFirst = await fetch('http://192.168.0.35:3000/api/Trader/' + senderID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        credentials: 'same-origin',        
        body: JSON.stringify({
            $class: "org.zendomo.biznet.Trader",
            tradeId: sender.id,
            firstName: sender.firstName,
            lastName: sender.lastName,
            tokens: sender.tokens - ammount,
            credits: sender.credits
        })
    });
    const thenDo = await fetch('http://192.168.0.35:3000/api/Trader/' + receiverID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'            
        },
        method: 'PUT',
        credentials: 'same-origin',        
        body: JSON.stringify({
            $class: "org.zendomo.biznet.Trader",
            tradeId: receiver.id,
            firstName: receiver.firstName,
            lastName: receiver.lastName,
            tokens: receiver.tokens,
            credits: receiver.credits + ammount
        })
    })
    .then(console.log(senderID + ' sent ' + receiverID + ' this much zen: ' + ammount));
}

// === admin tool to add funds to a person ===
const addFunds = async (id, ammount) => { 
    const person = await getOneUser(id)
    .then( response => {
        fetch('http://192.168.0.35:3000/api/Trader/' + response.tradeId, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            method: 'PUT',
            body: JSON.stringify({
                $class: "org.zendomo.biznet.Trader",
                tradeId: response.tradeId,
                firstName: response.firstName,
                lastName: response.lastName,
                tokens: ammount,
                credits: response.credits
            }),
            mode: 'cors'
        });
    });
    return;
}

// === admin tool to tip a user ===
const tipUser = async (id, ammount) => { 
    const person = await getOneUser(id)
    .then( response => {
        fetch('http://192.168.0.35:3000/api/Trader/' + response.tradeId, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            method: 'PUT',
            body: JSON.stringify({
                $class: "org.zendomo.biznet.Trader",
                tradeId: response.tradeId,
                firstName: response.firstName,
                lastName: response.lastName,
                tokens: response.tokens,
                credits: response.credits + ammount
            }),
            mode: 'cors'
        });
    });
    return;
}

module.exports = {
    createUser,
    getOneUser,
    deleteOneUser,
    editOneUser,
    getAllUsers,
    transferFunds,
    addFunds,
    tipUser
}
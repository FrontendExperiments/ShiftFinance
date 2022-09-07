import schemaQuery from "../schema/mongoDBConnect";
import {Promise} from "mongodb";
import {refreshAccessTokenLink} from "./AccessTokenHandler";

export async function getAllAccessTokensForUser(userid) {
    const schema = await schemaQuery()

    let user_token_coll = schema.collection("user_token");
    let token_find = await user_token_coll.find({userid, status: 'enabled'})
    let tokens = []

    await token_find.forEach(doc => tokens.push(doc.access_token));
    console.log("Fetched Access Tokens length:", tokens.length)

    for (let t of tokens) {
        await refreshAccessTokenLink(t, userid)
            .catch((e) => {
                let data = e.response.data.error_message
                console.log(data)
                if (!data.includes('Update mode: All provided products are authorized')){
                    console.log(e)
                }
            })
    }
    return tokens
}

export async function getAllUsers() {
    const schema = await schemaQuery()

    let all_users_list = []
    let users_coll = schema.collection("users");
    await (await users_coll.find({environment: process.env.PLAID_ENV || 'sandbox'})).forEach(doc => all_users_list.push(doc));
    return all_users_list
}

export async function saveUser({firstname, lastname, username}) {
    let schema = await schemaQuery()
    // let {firstname, lastname, username} = req.body;
    let users_coll = schema.collection("users");
    let user = await users_coll.insertOne({
        firstname,
        lastname,
        username,
        environment: process.env.PLAID_ENV || 'sandbox'
    })
    console.log(user)
}

export async function saveAccounts(userid, accountList) {
    const schema = await schemaQuery()
    let accounts_coll = schema.collection("accounts");

    for (let a of accountList) {
        let acc = await accounts_coll.findOne({
            "$and": [
                {account_id: a.account_id},
                {userid: userid}
            ]
        })

        if (acc === null) {
            let insert_result = await accounts_coll.insertOne({userid, ...a})
            console.log(insert_result)
        } else {
            console.log("AlreadyInserted")
        }
    }
}

export async function getAccounts(userid) {
    const schema = await schemaQuery()
    let accounts_coll = schema.collection("accounts");
    let acc = await accounts_coll.find({userid})
    let acc_list = []
    await acc.forEach(doc => acc_list.push(doc));
    return acc_list
}

export async function getLatestTransactionCursor(token) {
    const schema = await schemaQuery()
    let transactionCursor = schema.collection("transaction_cursor");
    let acc = await transactionCursor.find({token: token}).sort({_id: -1}).limit(1);
    let acc_list = []
    await acc.forEach(doc => acc_list.push(doc.cursor));
    if (acc_list.length)
        return acc_list[0]
    else
        return null
}

export async function saveLatestTransactionCursor(token, cursor) {
    const schema = await schemaQuery()
    let transactionCursor = schema.collection("transaction_cursor");
    return transactionCursor.insertOne({token, cursor})
}


async function modifyTransactions(modified) {
    if (modified.length === 0) {
        return []
    }
    const schema = await schemaQuery()
    let transactionCursor = schema.collection("transactions");
    let modifpromises = []
    for (let m of modified) {
        let res = transactionCursor.findOne({transaction_id: m.transaction_id, account_id: m.account_id})
            .then(doc => {
                return {...doc, ...m}
            })
            .then(doc => transactionCursor.updateOne({transaction_id: m.transaction_id, account_id: m.account_id}, res))
        modifpromises.push(res)
    }
    return await Promise.all(modifpromises)
}

async function removeTransaction(remove) {
    if (remove.length === 0) {
        return []
    }
    const schema = await schemaQuery()
    let transactionCursor = schema.collection("transactions");
    let delete_promises = []
    for (let m of remove) {
        let res = transactionCursor.deleteOne({transaction_id: m.transaction_id, account_id: m.account_id})
        delete_promises.push(res)
    }
    return await Promise.all(delete_promises)
}

async function addTransaction(added) {
    if (added.length === 0) {
        return []
    }
    const schema = await schemaQuery()
    let transactionCursor = schema.collection("transactions");
    return transactionCursor.insertMany(added)
}

export async function saveTransactionsToDB({added, modified, removed}) {
    await addTransaction(added).then(r => console.log("added transactions:", r.length))
    await modifyTransactions(modified).then(r => console.log("modified transactions:", r.length))
    await removeTransaction(removed).then(r => console.log("removed transactions:", r.length))
}

export async function getLastTransactions(accountid, page) {
    let page_len = 50;
    let start = page_len * page;

    if (page === undefined || page === null) {
        page = 0;
    }

    const schema = await schemaQuery()
    let transactionCursor = schema.collection("transactions");
    let acc = await transactionCursor.find({account_id: {"$in": accountid}}).sort({_id: -1}).skip(start).limit(page_len);
    let acc_list = []
    await acc.forEach(doc => acc_list.push(doc));
    return acc_list
}

export async function saveAccessToken(token, userid){
    let schema = await schemaQuery()
    let user_token_coll = schema.collection("user_token");
    return await user_token_coll.insertOne({
        access_token: token,
        userid: userid,
        status: 'enabled',
    })
}
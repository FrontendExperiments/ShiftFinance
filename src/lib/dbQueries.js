import schemaQuery from "../schema/mongoDBConnect";


export async function getAllAccessTokensForUser(userid) {
    const schema = await schemaQuery()

    let user_token_coll = schema.collection("user_token");
    let token_find = await user_token_coll.find({userid})
    let tokens = []

    await token_find.forEach(doc => tokens.push(doc.access_token));
    console.log("Fetched Access Tokens length:", tokens.length)
    return tokens
}

export async function getAllUsers() {
    const schema = await schemaQuery()

    let all_users_list = []
    let users_coll = schema.collection("users");
    await (await users_coll.find()).forEach(doc => all_users_list.push(doc));
    return all_users_list
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

        if (acc === null){
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

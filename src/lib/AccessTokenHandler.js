import {plaidClient} from "./plaid";
import schemaQuery from "../schema/mongoDBConnect";

let PLAID_CONSTS = {
    DEPOSITORY: "depository",
    CREDIT: "credit",

}

export async function postAccessTokenFunctions(access_token) {
    const response = await plaidClient.accountsBalanceGet(access_token);

    console.log(response.data)
}

export async function getAllAccountsFromAccessToken(userid){
    let schema = await schemaQuery()
    let user_token_coll = schema.collection("user_token");
    let token_find = await user_token_coll.find({userid})
    let tokens = []

    let accounts = []

    await token_find.forEach(doc => tokens.push(doc.access_token));

    for (let t of tokens){
        try {
            console.log("querying for token:", t)
            const response = await plaidClient.authGet({
                access_token: t
            });

            accounts = [...accounts, ...response.data.accounts]
        }
        catch (e){
            console.log(e.message)
        }
    }


    return accounts
}


export async function getNetWorth(accounts){
    let available_balance = 0;
    for(let a of accounts){
        console.log(a.official_name)
        if (a.type === PLAID_CONSTS.DEPOSITORY){
            available_balance += a.balances.available
        }
        else if (a.type === PLAID_CONSTS.CREDIT){
            available_balance -= a.balances.available
        }
    }
    console.log(available_balance)
    return available_balance
}
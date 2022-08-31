import {plaidClient} from "./plaid";

let PLAID_CONSTS = {
    DEPOSITORY: "depository",
    CREDIT: "credit",

}

export async function getAllAccountsFromAccessToken(accessTokenList) {
    let accounts = []
    let accountPromises = []

    for (let t of accessTokenList) {
        console.log("Retrieving:", t)
        try {
            accountPromises.push(plaidClient.authGet({access_token: t}))
        } catch (e) {
            console.log("Access Token", t, "Invalid. ", e.message)
        }

        let res = await Promise.all(accountPromises)

        for (let r of res){
            accounts = [...accounts, ...r.data.accounts]
        }
    }
    console.log(accounts)
    return accounts
}


export async function getNetWorth(accounts) {
    let available_balance = 0;
    for (let a of accounts) {
        console.log(a.official_name)
        if (a.type === PLAID_CONSTS.DEPOSITORY) {
            available_balance += a.balances.available
        } else if (a.type === PLAID_CONSTS.CREDIT) {
            available_balance -= a.balances.available
        }
    }
    return available_balance
}
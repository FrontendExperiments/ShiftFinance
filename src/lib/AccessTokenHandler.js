import {plaidClient} from "./plaid";

let PLAID_CONSTS = {
    DEPOSITORY: "depository",
    CREDIT: "credit",

}

export async function getAllAccountsFromAccessToken(accessTokenList) {
    let accounts = []

    for (let t of accessTokenList) {
        try {
            const response = await plaidClient.authGet({access_token: t});
            accounts = [...accounts, ...response.data.accounts]
        } catch (e) {
            console.log("Access Token", t, "Invalid. ", e.message)
        }
    }

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
import {plaidClient} from "./plaid";
import {getLatestTransactionCursor, saveLatestTransactionCursor, saveTransactionsToDB} from "./dbQueries";

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

        for (let r of res) {
            accounts = [...accounts, ...r.data.accounts]
        }
    }
    return accounts
}

export async function updateTransactions(accessToken) {
    let transactionsList = [{"blank test": 1}]

    let hasMore = true;
    let cursor = await getLatestTransactionCursor(accessToken);

    // Iterate through each page of new transaction updates for item
    while (hasMore) {
        const request = {
            access_token: accessToken,
            cursor: cursor,
        };
        const response = await plaidClient.transactionsSync(request);
        const data = response.data;

        let added = data.added
        let modified = data.modified
        let removed = data.removed;

        hasMore = data.has_more;

        // Update cursor to the next cursor
        cursor = data.next_cursor;
        await saveTransactionsToDB({added, modified, removed})
        await saveLatestTransactionCursor(accessToken, cursor)
    }

    return transactionsList
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
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
        let res = []
            // accountPromises.push()
            await plaidClient.authGet({access_token: t})
                .then(d => {
                    res.push(d)
                })
                .catch(e => {
                    if ("NO_AUTH_ACCOUNTS" !== e.response.data.error_code) {
                        console.log(e.response.data)
                        throw e.response.data
                    }
                })

        // let res = await Promise.all(accountPromises).catch(e=>{
        //     console.log(e.response.data)
        // })

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

export async function refreshAccessTokenLink(token, userid) {
    return plaidClient.linkTokenCreate({
        user: {
            client_user_id: userid
        },
        client_name: "ShiftFinance Web Client",
        language: 'en',
        products: [
            // 'assets',
            'auth',
            // 'employment',
            // 'identity',
            // 'income_verification',
            // 'identity_verification',
            // 'investments',
            // 'liabilities',
            // 'payment_initiation',
            // 'standing_orders',
            'transactions',
            // 'transfer',
        ],
        country_codes: ['US'],
        // redirect_uri: process.env.PLAID_REDIRECT_URI,
        access_token: token,

    })
}
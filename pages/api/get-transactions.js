import {withIronSessionApiRoute} from 'iron-session/next';
import {sessionOptions} from '../../src/lib/plaid';
import {getAccounts, getLastTransactions} from "../../src/lib/dbQueries";


export default withIronSessionApiRoute(accountListHandler, sessionOptions);

async function accountListHandler(req, res) {
    if (!req.session.userid) {
        return res.send({
            error: "user not logged in",
            error_code: "USER_INVALID"
        })
    }

    let accounts = []
    if (req.body.account_id === undefined) {
        accounts = []
        await (await getAccounts(req.session.userid)).forEach(a => accounts.push(a.account_id))
    } else {
        accounts = [req.body.account_id]
    }
    let tx = await getLastTransactions(accounts, req.body.page)
    res.send({ok: true, transactions: tx});
}
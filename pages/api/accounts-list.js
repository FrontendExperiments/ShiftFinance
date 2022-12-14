import {withIronSessionApiRoute} from 'iron-session/next';
import {sessionOptions} from '../../src/lib/plaid';
import {getAccounts} from "../../src/lib/dbQueries";


export default withIronSessionApiRoute(accountListHandler, sessionOptions);

async function accountListHandler(req, res) {
    console.log("Accounts List get request")
    if (!req.session.userid){
        return res.send({
            error: "user not logged in",
            error_code: "USER_INVALID"
        })
    }

    let accounts = await getAccounts(req.session.userid)
    res.send({ ok: true, accounts });
}
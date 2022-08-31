import {withIronSessionApiRoute} from 'iron-session/next';
import {sessionOptions} from '../../src/lib/plaid';
import {getAllAccountsFromAccessToken} from "../../src/lib/AccessTokenHandler";
import {getAllAccessTokensForUser} from "../../src/lib/dbQueries";


export default withIronSessionApiRoute(accountListHandler, sessionOptions);

async function accountListHandler(req, res) {
    if (!req.session.userid){
        return res.send({
            error: "user not logged in",
            error_code: "USER_INVALID"
        })
    }

    let accounts = await getAllAccountsFromAccessToken(await getAllAccessTokensForUser(req.session.userid))
    res.send({ ok: true, accounts });
}



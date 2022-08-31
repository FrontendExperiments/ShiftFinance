import {withIronSessionApiRoute} from 'iron-session/next';
import {sessionOptions} from '../../src/lib/plaid';
import {getAllAccountsFromAccessToken, getNetWorth} from "../../src/lib/AccessTokenHandler";
import {getAllAccessTokensForUser} from "../../src/lib/dbQueries";


export default withIronSessionApiRoute(exchangePublicToken, sessionOptions);

async function exchangePublicToken(req, res) {
    if (!req.session.userid){
        return res.json({
            error: "user not logged in",
            error_code: "USER_INVALID"
        })
    }

    let accounts = await getAllAccountsFromAccessToken(await getAllAccessTokensForUser(req.session.userid))
    let net_worth = await getNetWorth(accounts)

    res.send({ ok: true, net_worth });
}
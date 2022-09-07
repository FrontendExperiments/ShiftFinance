import {withIronSessionApiRoute} from 'iron-session/next';
import {plaidClient, sessionOptions} from '../../src/lib/plaid';
import schemaQuery from "../../src/schema/mongoDBConnect";
import {saveAccessToken} from "../../src/lib/dbQueries";


export default withIronSessionApiRoute(exchangePublicToken, sessionOptions);

async function exchangePublicToken(req, res) {
    if (!req.session.userid){
        return res.json({
            error: "user not logged in",
            error_code: "USER_INVALID"
        })
    }

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
        public_token: req.body.public_token,
    });
    await req.session.save();
    await saveAccessToken(exchangeResponse.data.access_token, req.session.userid)
    res.send({ ok: true });
}
import {withIronSessionApiRoute} from 'iron-session/next';
import {plaidClient, sessionOptions} from '../../src/lib/plaid';
import schemaQuery from "../../src/schema/mongoDBConnect";


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
    res.send({ ok: true });

    let schema = await schemaQuery()
    let user_token_coll = schema.collection("user_token");
    let token = await user_token_coll.insertOne({
        access_token: exchangeResponse.data.access_token,
        userid: req.session.userid
    })
}
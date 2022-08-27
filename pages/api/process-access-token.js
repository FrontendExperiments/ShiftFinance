import { withIronSessionApiRoute } from 'iron-session/next';
import { plaidClient, sessionOptions } from '../../src/lib/plaid';
import schemaQuery from "../../src/schema/mongoDBConnect";
import {postAccessTokenFunctions} from "../../src/lib/AccessTokenHandler";


export default withIronSessionApiRoute(exchangePublicToken, sessionOptions);

async function exchangePublicToken(req, res) {
    if (!req.session.userid){
        return res.json({
            error: "user not logged in",
            error_code: "USER_INVALID"
        })
    }

    let schema = await schemaQuery()
    let user_token_coll = schema.collection("user_token");
    let token_find = await user_token_coll.find({userid: req.session.userid})
    let tokens = []

    await token_find.forEach(doc => tokens.push(doc.access_token));

    let return_val = []

    for (let t in tokens){
        let result = await postAccessTokenFunctions(t)
        return_val.push(result)
    }

    res.send({ ok: true, return_val });
}
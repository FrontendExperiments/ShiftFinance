import {withIronSessionApiRoute} from 'iron-session/next';
import {sessionOptions} from '../../src/lib/plaid';
import schemaQuery from "../../src/schema/mongoDBConnect";


export default withIronSessionApiRoute(processAccessTokenHandler, sessionOptions);

async function processAccessTokenHandler(req, res) {
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

    res.send({ ok: true, return_val });
}
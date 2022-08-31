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

    let return_val = []
    res.send({ ok: true, return_val });
}
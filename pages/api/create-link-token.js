import {plaidClient, sessionOptions} from '../../src/lib/plaid';
import {withIronSessionApiRoute} from "iron-session/next";

export default withIronSessionApiRoute(createLinkTokenHandler, sessionOptions);

async function createLinkTokenHandler(req, res) {
    console.log(req.session.userid)
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Only POST requests allowed' })
        return
    }

    if (!req.session.userid){
        return res.json({
            error: "user not logged in",
            error_code: "USER_INVALID"
        })
    }

    const tokenResponse = await plaidClient.linkTokenCreate({
        user: { client_user_id: process.env.PLAID_CLIENT_ID },
        client_name: "Plaid's Tiny Quickstart",
        language: 'en',
        products: ['auth'],
        country_codes: ['US'],
        redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
    });

    return res.json(tokenResponse.data);
}
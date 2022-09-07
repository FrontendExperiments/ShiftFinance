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
        user: {
            client_user_id: req.session.userid
        },
        client_name: "ShiftFinance Web Client",
        language: 'en',
        products: [
            // 'assets',
            'auth',
            // 'employment',
            // 'identity',
            // 'income_verification',
            // 'identity_verification',
            // 'investments',
            // 'liabilities',
            // 'payment_initiation',
            // 'standing_orders',
            'transactions',
            // 'transfer'
        ],
        country_codes: ['US'],
        redirect_uri: process.env.PLAID_REDIRECT_URI,
    });

    return res.json(tokenResponse.data);
}
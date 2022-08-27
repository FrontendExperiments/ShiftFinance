import { withIronSessionApiRoute } from 'iron-session/next';
import {sessionOptions} from "../../src/lib/plaid";

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Only POST requests allowed' })
        return
    }

    console.log("User session set value: ", req.body.user)
    req.session.userid = req.body.user;
    await req.session.save();
    return res.json({user: req.body.user});
}
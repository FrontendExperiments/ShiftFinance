import {getAllAccountsFromAccessToken} from "../src/lib/AccessTokenHandler";
import exchangePublicToken from "../pages/api/exchange-public-token";
import createLinkTokenHandler from "../pages/api/create-link-token";
import {createMocks} from 'node-mocks-http';
import {getIronSession} from "iron-session";
import {sessionOptions} from "../src/lib/plaid";



describe("API Routes", () => {
    let {req, res} = createMocks({
        method: 'POST',
    });

    beforeEach(async () => {
        res.getHeader = jest.fn()
        res.setHeader = jest.fn()
        res.send = jest.fn()
        res.json = jest.fn()

        let session = await getIronSession(req, res, sessionOptions)
        req.session = session;
        session.userid = "helloworld"
        await session.save()

        req.headers.cookie = res.setHeader.mock.calls[res.setHeader.mock.calls.length - 1][1][0]
    });

    it("exchangePublicToken", async () => {

        let response = await exchangePublicToken(
            req,
            res
        )
        // res.setHeader.mock.calls[res.setHeader.mock.calls.length - 1][1][0]
        // expect(response.ok).toBe(true)
    })

    it("createLinkTokenHandler", async () => {
        let response = await createLinkTokenHandler(
            req,
            res
        )

        expect(response.ok).toBe(true)
    })

    it("createLinkTokenHandler", async () =>{
        let request = createLinkTokenHandler(req, res);
    })
})

describe("Plaid Tests", () => {
    it('Plaid Get Auth data', async () => {
        let examplePlaidAccessToken = [
            'access-sandbox-b40e8577-958a-4b67-b100-429dada1a8f5',
            'access-sandbox-f8747c4e-7108-448c-b555-c196e7507ab2',
            'access-sandbox-a1814d9f-093f-493a-b0ee-06f7bd14692a'
        ]
        let res = await getAllAccountsFromAccessToken(examplePlaidAccessToken)
        console.log(res)

        expect(true).toBe(true)
    });
})

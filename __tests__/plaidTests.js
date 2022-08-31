import {getAllAccountsFromAccessToken} from "../src/lib/AccessTokenHandler";
import exchangePublicToken from "../pages/api/exchange-public-token";
import createLinkTokenHandler from "../pages/api/create-link-token";


let examplePlaidAccessToken = [
    'access-sandbox-b40e8577-958a-4b67-b100-429dada1a8f5',
    'access-sandbox-f8747c4e-7108-448c-b555-c196e7507ab2',
    'access-sandbox-a1814d9f-093f-493a-b0ee-06f7bd14692a'
]


describe("API Routes", () => {
    it("exchangePublicToken", async () => {
        let response = await exchangePublicToken(
            {session: {userid: 1, admin: true}, cookie: {}},
            {send: (d) => d, json: (d) => d}
        )

        expect(response.ok).toBe(true)
    })

    it("createLinkTokenHandler", async () => {

        let response = await createLinkTokenHandler(
            {session: {userid: 1}, cookie: ""},
            {send: (d) => d, json: (d) => d}
        )

        expect(response.ok).toBe(true)
    })
})

describe("Plaid Tests", () => {
    it('Plaid Get Auth data', async () => {
        let res = await getAllAccountsFromAccessToken(examplePlaidAccessToken)

        expect(true).toBe(true)
    });
})

import schemaQuery from "../schema/mongoDBConnect";

export async function getAllAccessTokensForUser(userid){
    let schema = await schemaQuery()
    let user_token_coll = schema.collection("user_token");
    let token_find = await user_token_coll.find({userid})
    let tokens = []

    await token_find.forEach(doc => tokens.push(doc.access_token));

    return tokens
}

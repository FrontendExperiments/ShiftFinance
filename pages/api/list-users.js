import schemaQuery from "../../src/schema/mongoDBConnect"

export default async function listUsersHandler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Only POST requests allowed' })
        return
    }
    // Todo: Make sure the user session is known before printing all users and swap is allowed
    console.log("listusers query received")

    let schema = await schemaQuery()

    let users_coll = schema.collection("users");
    let all_users_list = []
    await (await users_coll.find()).forEach(doc => all_users_list.push(doc));
    return res.json(all_users_list);
}
import schemaQuery from "../../src/schema/mongoDBConnect"

export default async function handler(req, res) {
    console.log(req.body)
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }

    let schema = await schemaQuery()
    try{
        let {firstname, lastname, username} = req.body;

        let users_coll = schema.collection("users");
        let user = await users_coll.insertOne({firstname, lastname, username})
        // let user = await schema.User.create({
        //     firstname,
        //     lastname,
        //     username
        // });
        console.log(user)
        return res.json(user);
    } catch (e){
        return res.status(400).send({ error: e.message })
    }
    // return res.json({})
}
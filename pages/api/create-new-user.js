import sequelize from "../../src/schema/SFSchema"

export default async function handler(req, res) {

    console.log(req.body)
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }

    try{
        let {firstname, lastname, username} = req.body;
        // let user = new sequelize.models.User();

        // await user.create({
        //      firstname,
        //      lastname,
        //      username
        // })
    } catch (e){
        console.log(e.message)
        return res.status(400).send({ e })
    }

    return res.json({});
}
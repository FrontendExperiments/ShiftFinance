import {saveUser} from "../../src/lib/dbQueries";

export default async function createNewUserHandler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }

    try {
        let {firstname, lastname, username} = req.body
        let user = saveUser({firstname, lastname, username})
        return res.json(user);
    } catch (e){
        return res.status(400).send({ error: e.message })
    }
}
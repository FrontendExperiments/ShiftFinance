import {getAllUsers} from "../../src/lib/dbQueries";

export default async function listUsersHandler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Only POST requests allowed' })
        return
    }

    let all_users_list = await getAllUsers();
    return res.json(all_users_list);
}

import Router from "next/router";
import {useEffect, useState} from 'react';

export default function CreateUser() {
    const [usersList, setUserList] = useState([]);
    useEffect(() => {
        const listUsers = async () => {
            const response = await fetch('/api/list-users', {
                method: 'POST',
            });

            const token_response = await response.json()

            if (token_response.error !== undefined) {
                // Error is seen
                console.log("error", token_response)
                Router.push('/');
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    },
                };
            }
            // No error

            setUserList(token_response)
        };
        listUsers();
    }, []);

    async function setSessionUser(item){
        console.log("clicked:", item.id);

        const response = await fetch('/api/set-user', {
            method: 'POST',
            body: JSON.stringify({user: item.id}),
            headers: { 'Content-Type': 'application/json' }
        });

        let {user} = response.json()
        if (user !== undefined){
            Router.push('/user-set');
            return {
                redirect: {
                    destination: "/user-set",
                    permanent: false,
                },
            };
        }
    }

    const listItems = usersList.map((user) =>
        <li id={user._id} key={user._id} onClick={e=>setSessionUser(e.target)}>{user.username}</li>
    );

    return (
        <div>
            <ul>
            {listItems}
            </ul>
        </div>
    );
}



import Router from "next/router";
import {useEffect, useState} from 'react';
import {Button, Box} from "@chakra-ui/react";

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

    async function setSessionUser(item) {
        console.log("clicked:", item);

        const response = await fetch('/api/set-user', {
            method: 'POST',
            body: JSON.stringify({user: item}),
            headers: {'Content-Type': 'application/json'}
        });

        let {user} = response.json()
        if (user !== undefined) {
            Router.push('/user-set');
        }
    }

    const listItems = usersList.map((user) =>
        <li key={user._id}>
            <Button onClick={() => setSessionUser(user._id)}>
                <Box w={"200px"}>
                    {user.username}
                </Box>
            </Button>
        </li>
    );

    return (
        <Box
            padding={5}
            w={"400px"}
            margin={"auto"}>
            <ul>
                {listItems}
            </ul>
        </Box>
    );
}



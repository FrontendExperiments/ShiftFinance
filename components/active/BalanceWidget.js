import {Box} from "@chakra-ui/react";
import {useEffect, useState} from "react";


export default function BalanceTable(props) {
    useEffect(() => {
        const listAccounts = async () => {
            const response = await fetch('/api/accounts-list', {
                method: 'POST',
            });

            const response_data = await response.json()

            if (response_data.error !== undefined) {
                // Error is seen
                console.log(`error`, response_data.error)
                return
            }
            props.setAccounts(response_data.accounts)
        };
        listAccounts();
    }, []);

    const listItems = props.accounts.map((acc) =>
        <li key={acc.account_id}>{acc.official_name || acc.name}</li>
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
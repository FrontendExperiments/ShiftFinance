import {useEffect, useState} from "react";
import Router from "next/router";

export default function Dashboard() {
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        const listAccounts = async () => {
            const response = await fetch('/api/accounts-list', {
                method: 'POST',
            });

            const response_data = await response.json()

            if (response_data.error !== undefined) {
                // Error is seen
                alert(`error ${response_data.error}`, )
            }
            setAccounts(response_data.accounts)
        };
        listAccounts();
    }, []);

    console.log(accounts)

    const listItems = accounts.map((acc) =>
        <li key={acc.account_id}>{acc.official_name}</li>
    );

    return (
        <ul>
            {listItems}
        </ul>
    );
}
import {useCallback, useEffect, useState} from "react";
import Router from "next/router";
import {usePlaidLink} from "react-plaid-link";
import {Button} from "@chakra-ui/react";

export default function PlaidAddAccountButton({userid}) {
    const [token, setToken] = useState(null);

    console.log("userid sent from server during render:", userid)

    useEffect(() => {
        const createLinkToken = async () => {
            const response = await fetch('/api/create-link-token', {
                method: 'POST',
                body: JSON.stringify({userid}),
                headers: {'Content-Type': 'application/json'}
            });

            const token_response = await response.json()
            if (token_response.error !== undefined) {
                alert(`error ${token_response}`)
            }
            const {link_token} = token_response;
            setToken(link_token);
        };
        createLinkToken();
    }, []);

    const onSuccess = useCallback(async (publicToken) => {
        await fetch('/api/exchange-public-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({public_token: publicToken}),
        });
        alert("Account Successfully added")
    }, []);

    const {open, ready} = usePlaidLink({
        token,
        onSuccess,
    });

    return (
        <Button mt={4} colorScheme='teal' type='submit' onClick={() => open()} disabled={!ready}>
            Link account
        </Button>
    );
}
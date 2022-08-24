import Router from 'next/router';
import {useCallback, useEffect, useState} from 'react';
import {usePlaidLink} from 'react-plaid-link';
import {Button} from "@chakra-ui/react";

export default function PlaidLink() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const createLinkToken = async () => {
            const response = await fetch('/api/create-link-token', {
                method: 'POST',
            });

            const token_response = await response.json()

            if (token_response.error !== undefined) {
                console.log("error", token_response)
                Router.push('/listusers');
                return {
                    redirect: {
                        destination: '/listusers',
                        permanent: false,
                    },
                };

                // return token_response.error
            }

            const {link_token} = await response.json();
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
        Router.push('/dash');
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
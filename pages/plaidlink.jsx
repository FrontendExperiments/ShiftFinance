import Router from 'next/router';
import {useCallback, useEffect, useState} from 'react';
import {usePlaidLink} from 'react-plaid-link';
import {Button} from "@chakra-ui/react";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../src/lib/plaid";

export default function PlaidLink({userid}) {
    const [token, setToken] = useState(null);

    console.log("userid sent from server during render:", userid)

    useEffect(() => {
        const createLinkToken = async () => {
            const response = await fetch('/api/create-link-token', {
                method: 'POST',
                body: JSON.stringify({userid}),
                headers: { 'Content-Type': 'application/json' }
            });

            const token_response = await response.json()
            console.log("error", token_response)

            if (token_response.error !== undefined) {
                console.log("error", token_response)
                Router.push('/listusers');

                return {
                    redirect: {
                        destination: '/listusers',
                        permanent: false,
                    },
                };

                // return
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


export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        console.log(req.session)
        const userid = req.session.userid || "";
        console.log("user session id: ", userid)

        if (!userid) {
            return {
                redirect: {
                    destination: '/listusers',
                    permanent: false,
                },
            };
        }

        return {
            props: {
                userid
            },
        };
    },
    sessionOptions
);
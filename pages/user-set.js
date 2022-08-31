import {withIronSessionSsr} from 'iron-session/next';
import {sessionOptions} from '../src/lib/plaid';

export default function Dashboard({balance}) {
    return Object.entries(balance).map((entry, i) => (
        <pre key={i}>
            <code>{JSON.stringify(entry[1], null, 2)}</code>
        </pre>
    ));
}

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({req}) {
        const userid = req.session.userid;

        if (!userid) {
            return {
                redirect: {
                    destination: '/list-users',
                    permanent: false,
                },
            };
        }

        // const response = await plaidClient.accountsBalanceGet({access_token});
        return {
            props: {
                user: userid,
            },
        };
    },
    sessionOptions
);
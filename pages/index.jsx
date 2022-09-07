import {useState} from "react";
import BalanceTable from "../components/active/BalanceWidget";
import AccountsSyncButton from "../components/active/AccountsSyncButton";
import PlaidAddAccountButton from "../components/active/PlaidAddAccountButton";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../src/lib/plaid";
import ListUsersModal from "../components/active/ListUsersModal";
import {useRouter} from "next/router";

export default function Dashboard({userid}) {
    const [accounts, setAccounts] = useState([]);
    const router = useRouter()

    const handleClick = async (e, href) => {
        e.preventDefault()
        await router.push(href)
    }

    return (
        <>
            <BalanceTable accounts={accounts} setAccounts={setAccounts}/>
            <AccountsSyncButton setAccountsList={setAccounts}/>
            <PlaidAddAccountButton/>
            <ListUsersModal/>
            <a onClick={(e) => handleClick(e, "/transactions")}>Transactions</a>
        </>
    );
}

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({req}) {
        console.log(req.session)
        const userid = req.session.userid || "";
        console.log("user session id: ", userid)

        return {
            props: {
                userid
            },
        };
    },
    sessionOptions
);
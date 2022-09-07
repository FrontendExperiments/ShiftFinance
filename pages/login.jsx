import {useState} from "react";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../src/lib/plaid";
import ListUsersModal from "../components/active/ListUsersModal";
import {useRouter} from "next/router";

export default function Login() {
    const router = useRouter()

    return (
        <>
            <ListUsersModal/>
        </>
    );
}

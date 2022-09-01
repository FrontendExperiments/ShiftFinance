import {Button} from "@chakra-ui/react";


export default function AccountsSyncButton(props) {
    const syncAccounts = async () => {
        const response = await fetch('/api/sync-access-token-db', {
            method: 'POST',
        });

        const token_response = await response.json()

        if (token_response.error !== undefined) {
            // Error is seen
            alert(`error: ${token_response}`)
        }

        if (token_response.ok && props.setAccountsList) {
            let accounts = (await (await fetch('/api/accounts-list', {method: 'POST'})).json()).accounts;
            await props.setAccountsList(accounts)
        }
    };

    return (
        <Button onClick={syncAccounts}>Sync</Button>
    );
}
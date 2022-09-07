import {Button} from "@chakra-ui/react";

export default function TransactionsSyncButton({setTransactions}) {
    const syncTransactions = async () => {
        await fetch('/api/sync-transactions', {method: 'POST',})
            .then((r) => r.json())
            .then(d => {
                if (d.error)
                    alert(d.error)
                else
                    return d
            })
            .then(d => {
                setTransactions(d)
            })
            .catch(e => alert(e.message))
    };

    return (
        <Button onClick={syncTransactions}>Sync Transactions</Button>
    );
}
import {useEffect, useState} from "react";
import TransactionsSyncButton from "./TransactionsSyncButton";
import {DataTable} from "./datatable";
import {createColumnHelper} from "@tanstack/react-table";

export default function TransactionsTable() {
    const [transactions, setTransactions] = useState([]);

    let getTransactions = () =>
        fetch('/api/get-transactions', {method: 'POST',})
            .then((r) => r.json())
            .then(d => {
                if (d.error)
                    alert(d.error)
                else
                    return d
            })
            .then(d => {
                console.log(d.transactions)
                if (d.ok) {
                    console.log(d.transactions)
                    setTransactions(d.transactions)
                }
            })
            .catch(e => alert(e.message))

    useEffect(() => {
        getTransactions().then(r => {})
    }, [])


    const columnHelper = createColumnHelper()

    const columns = [
        columnHelper.accessor("authorized_date", {
            cell: (info) => info.getValue(),
            header: "Authorized Date"
        }),
        columnHelper.accessor("date", {
            cell: (info) => info.getValue(),
            header: "Posted Date"
        }),
        columnHelper.accessor("name", {
            cell: (info) => info.getValue(),
            header: "Transaction Name",
            // meta: {
            //     isNumeric: true
            // }
        }),
        columnHelper.accessor("category", {
            cell: (info) => info.getValue().join(","),
            header: "Amount",
        }),
        columnHelper.accessor("amount", {
            cell: (info) => info.getValue(),
            header: "Amount",
            meta: {
                isNumeric: true
            }
        }),
    ];

    return (
        <>
            <TransactionsSyncButton setTransactions={setTransactions}/>
            <DataTable columns={columns} data={transactions}/>
        </>
    );
}
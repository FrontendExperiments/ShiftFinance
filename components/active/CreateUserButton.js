import Router from "next/router";
import CreateUserModal from "./CreateUserModal";

export default function CreateUserButton(props) {


    return (
        <CreateUserModal handleSubmit={createUserSubmit}/>
    );
}
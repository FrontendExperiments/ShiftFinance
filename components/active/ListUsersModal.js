import {
    Avatar,
    Box,
    Button,
    HStack,
    List,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import Router from "next/router";
import CreateUserModal from "./CreateUserModal";


export default function ListUsersModal(props) {
    // console.log(props.handleSubmit)
    const {
        handleSubmit,
        register,
        formState: {errors, isSubmitting},
    } = useForm()


    const {isOpen, onOpen, onClose} = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const [usersList, setUserList] = useState([]);
    useEffect(() => {
        const listUsers = async () => {
            const response = await fetch('/api/list-users', {
                method: 'POST',
            });

            const token_response = await response.json()

            if (token_response.error !== undefined) {
                // Error is seen
                console.log("error", token_response)
            }
            // No error

            setUserList(token_response)
        };
        listUsers();
    }, []);

    async function setSessionUser(item, closeHandler) {
        console.log("clicked:", item);

        const response = await fetch('/api/set-user', {
            method: 'POST',
            body: JSON.stringify({user: item}),
            headers: {'Content-Type': 'application/json'}
        });

        let {user} = response.json()
        closeHandler()
    }

    const listItems = usersList.map((user) =>
        <ListItem key={user._id}>
            <Box as="button"
                 py={2}
                 px={4}
                 ml={3}
                 w={"90%"}
                 rounded="md"
                 fontWeight="semibold"
                 onClick={() => setSessionUser(user._id, onClose)}
                 _hover={{bg: "teal.600"}}
                 _focus={{boxShadow: "outline"}}>
                <HStack padding={2}>
                    <Avatar name={`${user.firstname} ${user.lastname}`} src='https://bit.ly/dan-abramov'/>
                    <span>{user.username}</span>
                </HStack>
            </Box>
        </ListItem>
    );

    return (
        <>
            <Button onClick={onOpen}>Change User</Button>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >

                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Switch User</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                        <List>
                            {listItems}
                        </List>
                    </ModalBody>

                    <ModalFooter>
                        <CreateUserModal/>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
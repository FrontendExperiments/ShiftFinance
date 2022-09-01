import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import React from 'react';
import {useForm} from "react-hook-form";
import Router from "next/router";

export default function CreateUserModal(props) {
    // console.log(props.handleSubmit)
    async function createUserSubmit(values) {
        const response = await fetch('/api/create-new-user', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {'Content-Type': 'application/json'}
        });

        if (response.statusCode === 200) {
            await Router.push("/listusers")
        }
    }

    const {
        handleSubmit,
        register,
        formState: {errors, isSubmitting},
    } = useForm()


    const {isOpen, onOpen, onClose} = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    let onSubmit = (values) => {
        onClose()
        if (props.handleSubmit) {
            return props.handleSubmit(values);
        } else {
            createUserSubmit(values)
        }
    }

    return (
        <>
            <Button onClick={onOpen}>Create User</Button>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>Create your account</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody pb={6}>

                            <FormControl mt={4} isInvalid={errors.firstname}>
                                {/*<FormLabel>First name</FormLabel>*/}
                                <FormLabel htmlFor='firstname'>First name</FormLabel>
                                {/*<Input ref={initialRef} placeholder='First name' />*/}
                                <Input
                                    id='firstname'
                                    placeholder='FirstName'
                                    {...register('firstname', {
                                        required: 'This is required',
                                        minLength: {value: 1, message: 'Minimum length should be 4'},
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.firstname && errors.firstname.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl mt={4} isInvalid={errors.lastname}>
                                <FormLabel htmlFor='lastname'>Last name</FormLabel>
                                <Input
                                    id='lastname'
                                    placeholder='Lastname'
                                    {...register('lastname', {
                                        required: 'This is required',
                                        minLength: {value: 1, message: 'Minimum length should be 4'},
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.lastname && errors.lastname.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl mt={4} isInvalid={errors.userid}>
                                <FormLabel htmlFor='userid'>Username</FormLabel>
                                <Input
                                    id='userid'
                                    placeholder='Username'
                                    {...register('username', {
                                        required: 'This is required',
                                        minLength: {value: 1, message: 'Minimum length should be 4'},
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.userid && errors.userid.message}
                                </FormErrorMessage>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button mr={3} colorScheme='teal' isLoading={isSubmitting}
                                    type='submit'>
                                Save
                            </Button>

                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    )
}
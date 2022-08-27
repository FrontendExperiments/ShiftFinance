import {useForm} from 'react-hook-form'
import {Box, Button, Center, FormControl, FormErrorMessage, FormLabel, Input} from '@chakra-ui/react'
import Router from "next/router";

export default function CreateUser() {
    const {
        handleSubmit,
        register,
        formState: {errors, isSubmitting},
    } = useForm()

    async function onSubmit(values) {
        console.log(values)
        const response = await fetch('/api/create-new-user', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.statusCode === 200){
            await Router.push("/listusers")
        }
    }

    return (
            <Box
                // paddingY={"20%"}
                padding={5}
                w={"400px"}
                margin={"auto"}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl isInvalid={errors.firstname}>
                        <FormLabel htmlFor='firstname'>First name</FormLabel>
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
                    <FormControl isInvalid={errors.firstname}>
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
                    <FormControl isInvalid={errors.userid}>
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
                    <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                        Submit
                    </Button>
                </form>
            </Box>
    );
}
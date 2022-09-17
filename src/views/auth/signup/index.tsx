import {
    Box,
    Button, Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Icon,
    Input,
    Text
} from "@chakra-ui/react";
import React, {ReactNode, useState} from "react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/auth.png";
import {FcGoogle} from "react-icons/fc";
import {HSeparator} from "components/separator/Separator";
import {NavLink} from "react-router-dom";
import {useAuthColors} from "variables/colors";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {signup} from "api/AccountAPI";
import PasswordInput from "components/fields/PasswordInput";

type Options = {
    username: string,
    email: string,
    password: string
}

function Group({title, children}: {title: string, children: ReactNode}) {
    const {
        textColorPrimary: textColor,
    } = useAuthColors()

    return <>
        <FormLabel
            ms='4px'
            fontSize='sm'
            fontWeight='500'
            color={textColor}
            mb='8px'>
            {title}
        </FormLabel>
        <Box mb='24px'>
            {children}
        </Box>
    </>
}

export default function SignUp() {
    // Chakra color mode
    const {
        textColorPrimary: textColor,
        textColorSecondary,
        textColorDetails,
        textColorBrand,
    } = useAuthColors()

    const [options, setOptions] = useState<Options>({
        username: "",
        email: "",
        password: ""
    })

    function update(options: Partial<Options>) {
        setOptions(prev => ({...prev, ...options}))
    }

    const client = useQueryClient()
    const mutation = useMutation(
        () => signup(options),
        {
            onSuccess() {
                client.setQueryData(['logged_in'], true)
            }
        }
    )

    return (
        <DefaultAuth illustrationBackground={illustration}>
            <Flex
                maxW={{ base: "100%", md: "max-content" }}
                w='100%'
                mx={{ base: "auto", lg: "0px" }}
                me='auto'
                h='100%'
                alignItems='start'
                justifyContent='center'
                px={{ base: "25px", md: "0px" }}
                flexDirection='column'>
                <Box me='auto'>
                    <Heading color={textColor} fontSize='36px' mb='10px'>
                        Sign Up
                    </Heading>
                    <Text
                        mb='36px'
                        ms='4px'
                        color={textColorSecondary}
                        fontWeight='400'
                        fontSize='md'>
                        Enter username, email and password to create your Account!
                    </Text>
                </Box>
                <Flex
                    zIndex='2'
                    direction='column'
                    w={{ base: "100%", md: "420px" }}
                    maxW='100%'
                    background='transparent'
                    borderRadius='15px'
                    mx={{ base: "auto", lg: "unset" }}
                    me='auto'
                    mb={{ base: "20px", md: "auto" }}>
                    <Button
                        fontSize='sm'
                        mb='26px'
                        py='25px'
                        fontWeight='500'>
                        <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
                        Sign up with Google
                    </Button>
                    <Flex align='center' mb='25px'>
                        <HSeparator />
                        <Text color='gray.400' mx='14px'>
                            or
                        </Text>
                        <HSeparator />
                    </Flex>
                    <FormControl>
                        <Group title='Username'>
                            <Input
                                isRequired={true}
                                variant='auth'
                                fontSize='sm'
                                type='email'
                                placeholder='Henry'
                                fontWeight='500'
                                size='lg'
                                value={options.username}
                                onChange={e => update({username: e.target.value})}
                            />
                        </Group>
                        <Group title='Email'>
                            <Input
                                isRequired={true}
                                variant='auth'
                                fontSize='sm'
                                ms={{ base: "0px", md: "0px" }}
                                type='email'
                                placeholder='your@email.com'
                                fontWeight='500'
                                size='lg'
                                value={options.email}
                                onChange={e => update({email: e.target.value})}
                            />
                        </Group>
                        <Group title='Password'>
                            <PasswordInput input={{
                                placeholder: 'Must longer than 8 characters',
                                value: options.password,
                                onChange: e => update({password: e.target.value})
                            }} />
                        </Group>
                        <FormControl display='flex' alignItems='center' mb='24px'>
                            <Checkbox
                                id='remember-login'
                                colorScheme='brandScheme'
                                me='10px'
                            />
                            <FormLabel
                                htmlFor='remember-login'
                                mb='0'
                                fontWeight='normal'
                                color={textColor}
                                fontSize='sm'>
                                Keep me logged in
                            </FormLabel>
                        </FormControl>
                        <Button
                            isLoading={mutation.isLoading}
                            onClick={() => mutation.mutate()}
                            fontSize='sm'
                            variant='brand'
                            fontWeight='500'
                            w='100%'
                            h='50'
                            mb='24px'>
                            Sign Up
                        </Button>
                    </FormControl>
                    <Flex
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='start'
                        maxW='100%'
                        mt='0px'>
                        <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
                            Already have an Account?
                            <NavLink to='/auth/sign-up'>
                                <Text
                                    color={textColorBrand}
                                    as='span'
                                    ms='5px'
                                    fontWeight='500'>
                                    Login
                                </Text>
                            </NavLink>
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </DefaultAuth>
    );
}
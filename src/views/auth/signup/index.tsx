import {
    Box,
    Button, Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Icon,
    Input, InputGroup, InputRightElement,
    Text
} from "@chakra-ui/react";
import React from "react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/auth.png";
import {FcGoogle} from "react-icons/fc";
import {HSeparator} from "components/separator/Separator";
import {RiEyeCloseLine} from "react-icons/ri";
import {MdOutlineRemoveRedEye} from "react-icons/md";
import {NavLink} from "react-router-dom";
import {useAuthColors} from "variables/colors";

export default function SignUp() {
    // Chakra color mode
    const {
        textColorPrimary: textColor,
        textColorSecondary,
        textColorDetails,
        textColorBrand,
    } = useAuthColors()

    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

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
                        <FormLabel
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color={textColor}
                            mb='8px'>
                            Username
                        </FormLabel>
                        <Input
                            isRequired={true}
                            variant='auth'
                            fontSize='sm'
                            type='email'
                            placeholder='Henry'
                            mb='24px'
                            fontWeight='500'
                            size='lg'
                        />
                        <FormLabel
                            display='flex'
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color={textColor}
                            mb='8px'>
                            Email
                        </FormLabel>
                        <Input
                            isRequired={true}
                            variant='auth'
                            fontSize='sm'
                            ms={{ base: "0px", md: "0px" }}
                            type='email'
                            placeholder='your@email.com'
                            mb='24px'
                            fontWeight='500'
                            size='lg'
                        />
                        <FormLabel
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color={textColor}
                            display='flex'>
                            Password
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                isRequired={true}
                                fontSize='sm'
                                placeholder='Must longer than 8 characters'
                                mb='24px'
                                size='lg'
                                type={show ? "text" : "password"}
                                variant='auth'
                            />
                            <InputRightElement display='flex' alignItems='center' mt='4px'>
                                <Icon
                                    color={textColorSecondary}
                                    _hover={{ cursor: "pointer" }}
                                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                                    onClick={handleClick}
                                />
                            </InputRightElement>
                        </InputGroup>
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
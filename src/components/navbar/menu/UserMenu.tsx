import {
    Avatar,
    Flex,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    SkeletonCircle,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import {UserType, useUserQuery} from "api/UserAPI";
import {useLogoutMutation} from "api/AccountAPI";

export function UserMenu(props: {color: string, shadow: string, bg: string}) {
    const query = useUserQuery()

    return <Menu>
        <MenuButton p='0px'>
            {query.isLoading ?
                <SkeletonCircle
                    w='40px'
                    h='40px'
                /> :
                <Avatar
                    _hover={{cursor: 'pointer'}}
                    color='white'
                    name={query.data.username}
                    src={query.data.avatarUrl}
                    bg='#11047A'
                    w='40px'
                    h='40px'
                />
            }
        </MenuButton>
        {query.isLoading || <List user={query.data} shadow={props.shadow} menuBg={props.bg} textColor={props.color}/>}
    </Menu>
}

function List(props: {textColor: string, shadow: string, menuBg: string, user: UserType}) {
    const {menuBg, shadow, textColor, user} = props
    const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
    const logout = useLogoutMutation()

    return <MenuList boxShadow={shadow} p='0px' mt='10px' borderRadius='20px' bg={menuBg} border='none'>
        <Flex w='100%' mb='0px'>
            <Text
                ps='20px'
                pt='16px'
                pb='10px'
                w='100%'
                borderBottom='1px solid'
                borderColor={borderColor}
                fontSize='sm'
                fontWeight='700'
                color={textColor}>
                👋&nbsp; Hey, {user.username}
            </Text>
        </Flex>
        <Flex flexDirection='column' p='10px'>
            <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} borderRadius='8px' px='14px'>
                <Text fontSize='sm'>Profile Settings</Text>
            </MenuItem>
            <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} borderRadius='8px' px='14px'>
                <Text fontSize='sm'>Newsletter Settings</Text>
            </MenuItem>
            <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color='red.400'
                borderRadius='8px'
                onClick={() => logout.mutate()}
                px='14px'>
                <Text fontSize='sm'>Log out</Text>
            </MenuItem>
        </Flex>
    </MenuList>
}
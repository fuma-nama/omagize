import {
    Button,
    Flex, HStack,
    useColorModeValue
} from "@chakra-ui/react";
import {SearchBar} from "components/navbar/searchBar/SearchBar";
import {SidebarResponsive} from "components/sidebar/Sidebar";
import routes from "routes";
import ThemeSwitch from "components/navbar/components/ThemeSwitch";
import {UserMenu} from "components/navbar/menu/UserMenu";
import React, {useContext} from "react";
import {BiArrowBack} from "react-icons/bi";
import {useNavigate} from "react-router-dom";
import {PageContext} from "contexts/PageContext";

export default function GroupNavbar() {
    // Chakra Color Mode
    const navbarIcon = useColorModeValue('gray.400', 'white');
    let menuBg = useColorModeValue('white', 'navy.800');
    const textColor = useColorModeValue('secondaryGray.900', 'white');

    const shadow = useColorModeValue(
        '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
        '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
    );
    const {selectedGroup} = useContext(PageContext)
    const navigate = useNavigate()

    return (
        <Flex
            w={{ base: '100%', md: 'auto' }}
            direction='column'
            gap={2}
            bg={menuBg}
            p='10px'
            borderRadius='30px'
            boxShadow={shadow}>
            <HStack ml={2}>
                <Button leftIcon={<BiArrowBack />} onClick={() => navigate(`/user/${selectedGroup}`)} variant="link">
                    Back
                </Button>
            </HStack>
            <HStack align='center'>
                <SearchBar
                    mb='unset'
                    me='10px'
                    borderRadius='30px'
                />
                <SidebarResponsive routes={routes} />

                <ThemeSwitch color={navbarIcon} />
                <UserMenu color={textColor} shadow={shadow} bg={menuBg} />
            </HStack>
        </Flex>
    );
}
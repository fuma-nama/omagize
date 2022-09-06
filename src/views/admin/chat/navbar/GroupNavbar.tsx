import {
    Flex,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorMode,
    useColorModeValue
} from "@chakra-ui/react";
import {SearchBar} from "../../../../components/navbar/searchBar/SearchBar";
import {SidebarResponsive} from "../../../../components/sidebar/Sidebar";
import routes from "../../../../routes";
import {MdNotificationsNone} from "react-icons/md";
import {ItemContent} from "../../../../components/menu/ItemContent";
import ThemeSwitch from "../../../../components/navbar/components/ThemeSwitch";
import {UserMenu} from "../../../../components/navbar/profile/UserMenu";
import React from "react";

export default function GroupNavbar() {
    // Chakra Color Mode
    const navbarIcon = useColorModeValue('gray.400', 'white');
    let menuBg = useColorModeValue('white', 'navy.800');
    const textColor = useColorModeValue('secondaryGray.900', 'white');

    const shadow = useColorModeValue(
        '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
        '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
    );

    return (
        <Flex
            w={{ sm: '100%', md: 'auto' }}
            alignItems='center'
            flexDirection='row'
            bg={menuBg}
            p='10px'
            borderRadius='30px'
            boxShadow={shadow}>
            <SearchBar
                mb='unset'
                me='10px'
                borderRadius='30px'
            />
            <SidebarResponsive routes={routes} />

            <ThemeSwitch color={navbarIcon} />
            <UserMenu color={textColor} shadow={shadow} bg={menuBg} />
        </Flex>
    );
}
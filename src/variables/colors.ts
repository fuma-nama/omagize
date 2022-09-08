import {useColorModeValue} from "@chakra-ui/react";

export function useItemHoverBg() {
    return useColorModeValue(
        { bg: 'white', boxShadow: '0px 40px 58px -20px rgba(112, 144, 176, 0.12)' },
        { bg: 'navy.700', boxShadow: 'unset' }
    );
}
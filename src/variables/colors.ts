import {useColorModeValue} from "@chakra-ui/react";

export function useItemHoverBg() {
    return useColorModeValue(
        { bg: 'white', boxShadow: '0px 40px 58px -20px rgba(112, 144, 176, 0.12)' },
        { bg: 'navy.700', boxShadow: 'unset' }
    );
}

export function useColors() {

    return {
        brand: useColorModeValue('brand.500', 'brand.400'),
        textColorPrimary: useColorModeValue('secondaryGray.900', 'white'),
        textColorSecondary: 'gray.400',
        borderColor: useColorModeValue('white !important', '#111C44 !important'),
        cardBg: useColorModeValue('white', 'navy.800'),
        menuBg: useColorModeValue('white', 'navy.800'),
        shadow: useColorModeValue(
            '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
            '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
        )
    }
}

export function useNavbarColors() {
    return {
        textColorBrand: useColorModeValue('brand.700', 'brand.400'),
        iconColor: useColorModeValue('gray.400', 'white'),
        ...useColors()
    }
}
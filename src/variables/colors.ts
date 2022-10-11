import {useColorModeValue} from "@chakra-ui/react";

export function useItemHoverBg() {
    return useColorModeValue(
        { bg: 'white', boxShadow: '0px 40px 58px -20px rgba(112, 144, 176, 0.12)' },
        { bg: 'navy.700', boxShadow: 'unset' }
    );
}
export function useAuthColors() {
    return {
        textColorBrand: useColorModeValue("brand.500", "white"),
        brandStars: useColorModeValue("brand.500", "brand.400"),
        googleBg: useColorModeValue("secondaryGray.300", "whiteAlpha.200"),
        googleText: useColorModeValue("navy.700", "white"),
        buttonHover: useColorModeValue(
            { bg: "gray.200" },
            { bg: "whiteAlpha.300" }
        ),
        buttonActive: useColorModeValue(
            { bg: "secondaryGray.300" },
            { bg: "whiteAlpha.200" }
        ),
        ...useColors()
    }
}
export function useColors() {

    return {
        globalBg: useColorModeValue('secondaryGray.300', 'navy.900'),
        brand: useColorModeValue('brand.500', 'brand.400'),
        textColorPrimary: useColorModeValue('secondaryGray.900', 'white'),
        textColorSecondary: 'gray.400',
        textColorDetails: useColorModeValue("navy.700", "secondaryGray.600"),
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
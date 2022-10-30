import { useColorMode, useColorModeValue } from '@chakra-ui/react';

export function useItemHoverBg() {
  return useColorModeValue(
    { bg: 'white', boxShadow: '0px 40px 58px -20px rgba(112, 144, 176, 0.12)' },
    { bg: 'navy.700', boxShadow: 'unset' }
  );
}
export function useAuthColors() {
  const extand = useColorModeValue(
    {
      textColorBrand: 'brand.500',
      brandStars: 'brand.500',
      googleBg: 'secondaryGray.300',
      googleText: 'navy.700',
      buttonHover: { bg: 'gray.200' },
      buttonActive: { bg: 'secondaryGray.300' },
    },
    {
      textColorBrand: 'white',
      brandStars: 'brand.400',
      googleBg: 'whiteAlpha.200',
      googleText: 'white',
      buttonHover: { bg: 'whiteAlpha.300' },
      buttonActive: { bg: 'whiteAlpha.200' },
    }
  );
  return {
    ...extand,
    ...useColors(),
  };
}
export function useColors() {
  return useColorModeValue(
    {
      globalBg: 'secondaryGray.300',
      brand: 'brand.500',
      textColorPrimary: 'secondaryGray.900',
      textColorSecondary: 'gray.400',
      textColorDetails: 'navy.700',
      borderColor: 'white !important',
      cardBg: 'white',
      menuBg: 'white',
      shadow: '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    },
    {
      globalBg: 'navy.900',
      brand: 'brand.400',
      textColorPrimary: 'white',
      textColorSecondary: 'gray.400',
      textColorDetails: 'secondaryGray.600',
      borderColor: '#111C44 !important',
      cardBg: 'navy.800',
      menuBg: 'navy.800',
      shadow: '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
    }
  );
}

export function useNavbarColors() {
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';

  return {
    textColorBrand: dark ? 'brand.700' : 'brand.400',
    iconColor: dark ? 'gray.400' : 'white',
    ...useColors(),
  };
}

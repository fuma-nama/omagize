import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { dark, light } from 'variables/colors';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys
);

const defaultStyle = {
  border: '2px solid',
  borderRadius: '16px',
  fontSize: 'sm',
  p: '20px',
  _light: {
    color: 'secondaryGray.900',
    bg: 'transparent',
    _placeholder: {
      color: 'secondaryGray.700',
    },
    borderColor: 'secondaryGray.400',
  },
  _dark: {
    color: 'white',
    bg: 'navy.800',
    _placeholder: {
      color: 'secondaryGray.600',
    },
    borderColor: 'navy.600',
  },
};

export const inputStyles = defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    field: {
      fontWeight: 400,
      _light: {
        borderColor: light.textColorSecondary,
      },
      _dark: {
        borderColor: dark.textColorSecondary,
      },
      borderRadius: '8px',
    },
  }),

  variants: {
    main: definePartsStyle({
      field: defaultStyle,
    }),
    focus: definePartsStyle({
      field: {
        ...defaultStyle,
        _focus: {
          _light: {
            borderColor: 'brand.300',
          },
          _dark: {
            borderColor: 'brand.400',
          },
        },
      },
    }),
    auth: definePartsStyle({
      field: {
        bg: 'transparent',
        fontWeight: '500',
        _light: {
          color: 'navy.700',
          borderColor: 'secondaryGray.100',
        },
        _dark: {
          color: 'white',
          borderColor: 'rgba(135, 140, 189, 0.3)',
        },
        border: '1px solid',
        borderRadius: '16px',
        _placeholder: { color: 'secondaryGray.600', fontWeight: '400' },
      },
    }),
    authSecondary: definePartsStyle({
      field: {
        bg: 'transparent',
        border: '1px solid',
        borderColor: 'secondaryGray.100',
        borderRadius: '16px',
        _placeholder: { color: 'secondaryGray.600' },
      },
    }),
    search: definePartsStyle({
      field: {
        border: 'none',
        py: '11px',
        borderRadius: 'inherit',
        _placeholder: { color: 'secondaryGray.600' },
      },
    }),
  },
});

import { mode } from '@chakra-ui/theme-tools';

export const CardComponent = {
  components: {
    Card: {
      baseStyle: (props: any) => ({
        p: '20px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
        borderRadius: '20px',
        minWidth: '0px',
        wordWrap: 'break-word',
        bg: mode('#ffffff', 'navy.800')(props),
        backgroundClip: 'border-box',
      }),
      variants: {
        input: (props: any) => ({
          bg: mode('transparent', 'navy.800')(props),
          px: 3,
          py: 2,
          border: '2px solid',
          _focus: {
            borderColor: mode('brand.300', 'brand.400')(props),
          },
          color: mode('secondaryGray.900', 'white')(props),
          borderColor: mode('secondaryGray.400', 'navy.600')(props),
          borderRadius: '16px',
        }),
      },
    },
  },
};

import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export const modalStyles: Dict = {
  components: {
    Modal: {
      parts: ['content', 'overlay'],
      baseStyle: (props: any) => ({
        dialog: {
          bg: mode('secondaryGray.300', 'navy.900')(props),
        },
        overlay: {
          backdropFilter: 'auto',
          backdropBlur: 'lg',
        },
        closeButton: {
          _hover: {},
          _focus: {},
        },
      }),
    },
    Popover: {
      baseStyle: (props: any) => ({
        content: {
          bg: mode('secondaryGray.300', 'navy.900')(props),
          rounded: 'xl',
          _focus: {
            boxShadow: 'none',
          },
        },
      }),
    },
  },
};

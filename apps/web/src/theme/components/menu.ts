import { mode } from '@chakra-ui/theme-tools';
import { dark, light } from 'variables/colors';

// define the base component styles
// export the base styles in the component theme
export const menuTheme = {
  components: {
    Menu: {
      parts: ['list'],
      baseStyle: (props: any) => ({
        list: {
          bg: mode(light.globalBg, dark.globalBg)(props),
        },
      }),
    },
  },
};

import { SystemStyleObject } from '@chakra-ui/styled-system';
import { dark, light } from './colors';

export const styles: SystemStyleObject = {
  w: 'full',
  h: 'full',
  _light: {
    color: light.textColorPrimary,
    bg: light.globalBg,
  },
  _dark: {
    color: dark.textColorPrimary,
    bg: dark.globalBg,
  },
};

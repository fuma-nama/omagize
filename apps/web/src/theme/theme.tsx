import { extendTheme, HTMLChakraProps, ThemingProps } from '@chakra-ui/react';
import { buttonStyles } from './components/button';
import { badgeStyles } from './components/badge';
import { inputStyles } from './components/input';
import { progressStyles } from './components/progress';
import { sliderStyles } from './components/slider';
import { textareaStyles } from './components/textarea';
import { switchStyles } from './components/switch';
import { linkStyles } from './components/link';
import { breakpoints } from './foundations/breakpoints';
import { globalStyles } from './styles';
import { modalStyles } from './components/modal';
import { avatarStyles } from './components/avatar';
import { StepsStyleConfig as Steps } from '@omagize/chakra-ui-steps';
import { menuTheme } from './components/menu';
import { pinInputTheme } from './components/pin-input';

export default extendTheme(
  { breakpoints }, // Breakpoints
  globalStyles,
  badgeStyles, // badge styles
  buttonStyles, // button styles
  linkStyles, // link styles
  progressStyles, // progress styles
  sliderStyles, // slider styles
  inputStyles, // input styles
  switchStyles, // switch styles
  modalStyles,
  avatarStyles,
  menuTheme,
  {
    components: {
      Input: inputStyles,
      PinInput: pinInputTheme,
      Textarea: textareaStyles,
      Steps,
    },
  }
);

export interface CustomCardProps extends HTMLChakraProps<'div'>, ThemingProps {}

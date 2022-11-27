import {
  chakra,
  HStack,
  StackProps,
  FlexProps,
  Flex,
  defineStyle,
  defineStyleConfig,
  forwardRef,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { CustomCardProps } from 'theme/theme';
import { useItemHoverBg } from '../../variables/colors';

export const CardInput = chakra(
  'div',
  defineStyleConfig({
    baseStyle: defineStyle({
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      minWidth: '0px',
      wordWrap: 'break-word',
      _light: {
        bg: 'transparent',
        borderColor: 'secondaryGray.400',
        color: 'secondaryGray.900',
      },
      _dark: {
        bg: 'navy.800',
        borderColor: 'navy.600',
        color: 'white',
      },
      backgroundClip: 'border-box',
      px: 3,
      py: 2,
      border: 'solid 2px',
      borderRadius: '16px',
    }),
  })
);
const CustomCard = forwardRef<CustomCardProps, 'div'>((props, ref) => {
  const bg = useColorModeValue('#ffffff', 'navy.800');

  return (
    <Box
      ref={ref}
      p="20px"
      display="flex"
      flexDirection="column"
      width="100%"
      position="relative"
      borderRadius="20px"
      minWidth="0px"
      wordWrap="break-word"
      bg={bg}
      backgroundClip="border-box"
      {...props}
    />
  );
});

export default CustomCard;
export function CardButton(props: CustomCardProps) {
  const hoverBg = useItemHoverBg();
  return (
    <CustomCard
      {...props}
      transition="0.2s all"
      _hover={{ cursor: 'pointer', ...hoverBg, ...props._hover }}
    />
  );
}

export function TagCard(props: StackProps) {
  return (
    <HStack rounded="full" p={2} {...props}>
      {props.children}
    </HStack>
  );
}

export function TagFlex(props: FlexProps) {
  return (
    <Flex rounded="full" p={2} gap={2} direction="row" align="center" {...props}>
      {props.children}
    </Flex>
  );
}

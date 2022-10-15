// import { Box, useStyleConfig} from '@chakra-ui/react';

import {
  useStyleConfig,
  chakra,
  forwardRef,
  HStack,
  StackProps,
  FlexProps,
  Flex,
} from '@chakra-ui/react';
import { CustomCardProps } from 'theme/theme';
import { useItemHoverBg } from '../../variables/colors';
const CustomCard = forwardRef<CustomCardProps, 'div'>((props, ref) => {
  const { size, variant, ...rest } = props;
  const styles = useStyleConfig('Card', { size, variant });

  return <chakra.div ref={ref} __css={styles} {...rest} />;
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
    <Flex
      rounded="full"
      p={2}
      gap={2}
      direction="row"
      align="center"
      {...props}
    >
      {props.children}
    </Flex>
  );
}

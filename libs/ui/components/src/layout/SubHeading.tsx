import { Text, TextProps } from '@chakra-ui/layout';

export function SubHeading(props: TextProps) {
  return <Text fontSize={{ base: 'xl', '3sm': '2xl' }} fontWeight="700" {...props} />;
}

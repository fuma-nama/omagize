import { ReactNode } from 'react';
import { Center, CenterProps, Text } from '@chakra-ui/react';
import { useColors } from '../variables/colors';

export function Placeholder({
  children,
  ...rest
}: { children: string } & CenterProps) {
  const { textColorSecondary, cardBg } = useColors();

  return (
    <Center w="full" py="50px" bg={cardBg} rounded="xl" {...rest}>
      <Text color={textColorSecondary} fontSize="xl" align="center">
        {children}
      </Text>
    </Center>
  );
}
export function ArrayHolder({
  array,
  placeholder,
  ...props
}: {
  array?: any[];
  placeholder?: string | ReactNode;
  skeleton?: ReactNode;
  children: ReactNode | (() => ReactNode);
}) {
  const { textColorSecondary } = useColors();
  const empty = array && array.length === 0;

  if (empty) {
    if (typeof placeholder === 'string') {
      return (
        <Text mx="auto" color={textColorSecondary}>
          {placeholder}
        </Text>
      );
    } else {
      return <> {placeholder} </>;
    }
  }

  return (
    <Holder isLoading={array == null} {...props}>
      {props.children}
    </Holder>
  );
}

export function Holder({
  isLoading,
  skeleton,
  children,
}: {
  isLoading?: boolean;
  skeleton?: ReactNode;
  children: ReactNode | (() => ReactNode);
}) {
  if (isLoading) {
    return <>{skeleton}</>;
  }

  return <>{typeof children === 'function' ? children() : children}</>;
}

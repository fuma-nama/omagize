import { Fragment, ReactElement, ReactNode } from 'react';
import { Box, Center, CenterProps, Text } from '@chakra-ui/react';
import { useColors } from '@omagize/ui/theme';

export function PlaceholderLayout({
  watch,
  placeholder,
  children,
}: {
  watch?: any[] | null;
  placeholder: ReactElement;
  children: ReactNode;
}) {
  if (watch?.length === 0) return placeholder;

  return <>{children}</>;
}

export function Placeholder({
  children,
  icon,
  ...rest
}: { icon?: ReactNode; children: string } & CenterProps) {
  const { textColorSecondary } = useColors();

  return (
    <Center w="full" py="50px" flexDirection="column" rounded="xl" {...rest}>
      <Box color={textColorSecondary}>{icon}</Box>
      <Text color={textColorSecondary} align="center">
        {children}
      </Text>
    </Center>
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

export function Repeat({ times, children }: { times: number; children: ReactNode }) {
  const repeat = Array.from({ length: times }, (_, i) => <Fragment key={i}>{children}</Fragment>);

  return <>{repeat}</>;
}

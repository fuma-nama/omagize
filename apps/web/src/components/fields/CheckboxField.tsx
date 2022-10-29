import { Checkbox, CheckboxProps, FormLabel, HStack } from '@chakra-ui/react';
import { useColors } from 'variables/colors';

export default function CheckboxField({
  id,
  label,
  ...rest
}: { id: string; label: string } & CheckboxProps) {
  const { textColorPrimary: textColor } = useColors();

  return (
    <HStack>
      <Checkbox id={id} colorScheme="brandScheme" me="10px" {...rest} />
      <FormLabel
        htmlFor={id}
        mb="0"
        _hover={{ cursor: 'pointer' }}
        fontWeight="normal"
        color={textColor}
        fontSize="sm"
      >
        {label}
      </FormLabel>
    </HStack>
  );
}

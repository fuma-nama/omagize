import {
  Icon,
  Input,
  InputGroup,
  InputGroupProps,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react';
import { RiEyeCloseLine } from 'react-icons/ri';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import React from 'react';
import { useColors } from 'variables/colors';

export default function PasswordInput(props: {
  input?: InputProps;
  group?: InputGroupProps;
}) {
  const [show, setShow] = React.useState(false);
  const { textColorSecondary } = useColors();

  return (
    <InputGroup size="md" {...props.group}>
      <Input
        isRequired={true}
        fontSize="sm"
        size="lg"
        type={show ? 'text' : 'password'}
        variant="auth"
        {...props.input}
      />
      <InputRightElement display="flex" alignItems="center" mt="4px">
        <Icon
          color={textColorSecondary}
          _hover={{ cursor: 'pointer' }}
          as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
          onClick={() => setShow(!show)}
        />
      </InputRightElement>
    </InputGroup>
  );
}

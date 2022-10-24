import { Button, Icon } from '@chakra-ui/react';
import { FirebaseAuth } from '@omagize/api';
import { FcGoogle } from 'react-icons/fc';

export function GoogleSignInButton(props: {}) {
  return (
    <Button
      fontSize="sm"
      mb="26px"
      py="25px"
      fontWeight="500"
      onClick={() => FirebaseAuth.signInWithGoogle()}
    >
      <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
      Sign up with Google
    </Button>
  );
}

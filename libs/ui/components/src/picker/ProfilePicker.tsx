import { Center, useColorModeValue, Avatar } from '@chakra-ui/react';
import { Pick } from '../layout/Pick';

export type ProfilePickerProps = {
  selectBanner: () => void;
  selectIcon: () => void;
  bannerUrl: string;
  iconUrl: string;
  name?: string;
};
export function ProfilePicker(props: ProfilePickerProps) {
  const bannerBg = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  return (
    <Center
      onClick={props.selectBanner}
      w="full"
      bg={props.bannerUrl ? null : bannerBg}
      bgImg={props.bannerUrl}
      bgSize="cover"
      p={5}
      my={2}
      rounded="xl"
      _hover={{ cursor: 'pointer' }}
    >
      <Pick
        onClick={(e) => {
          props.selectIcon();
          e.stopPropagation();
        }}
      >
        <Avatar
          border="auto"
          borderWidth={2}
          borderStyle="solid"
          borderColor="navy.800"
          src={props.iconUrl}
          name={props.name}
          size="xl"
        />
      </Pick>
    </Center>
  );
}

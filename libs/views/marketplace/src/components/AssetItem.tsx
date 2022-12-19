import { Flex, Image, Spacer, Text } from '@chakra-ui/react';
import { Card } from '@omagize/ui/components';
import { useColorsExtend, useItemHoverBg } from '@omagize/ui/theme';

export function AssetItem(props: { image: string; name: string; author: string; date: string }) {
  const { image, name, author, date } = props;
  // Chakra Color Mode
  const bgItem = useItemHoverBg();
  const { textColorDate, textColorSecondary } = useColorsExtend(
    {
      textColorDate: 'brand.400',
    },
    {
      textColorDate: 'white',
    }
  );

  return (
    <Card
      _hover={bgItem}
      bg="transparent"
      boxShadow="unset"
      px="24px"
      py="21px"
      transition="0.2s linear"
      flexDirection="row"
      gap="10px"
    >
      <Image src={image} w="66px" h="66px" borderRadius="20px" me="6px" />
      <Flex direction="column" gap="5px">
        <Text fontSize="md" fontWeight="bold">
          {name}
        </Text>
        <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
          By {author}
        </Text>
      </Flex>
      <Spacer />
      <Text ms="auto" fontWeight="700" fontSize="sm" color={textColorDate}>
        {date}
      </Text>
    </Card>
  );
}

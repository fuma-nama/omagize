import { AssetItem } from './components/AssetItem';
import { Button, Flex } from '@chakra-ui/react';
import { Card, SubHeading } from '@omagize/ui/components';
import { Assets } from '@omagize/api';
import { stringOfDate } from '@omagize/utils/common';

export function SidePanel({ recommends }: { recommends?: Assets }) {
  return (
    <Card px="10px">
      <Flex align="center" justify="space-between" w="100%" px="12px" mb="20px">
        <SubHeading>Recommended</SubHeading>
        <Button variant="action">See all</Button>
      </Flex>
      <Flex direction="column" gap="10px">
        {recommends?.emojis?.map((emoji) => (
          <AssetItem
            key={emoji.id}
            image={emoji.url}
            name={emoji.name}
            author={emoji.author.username}
            date={stringOfDate(emoji.createdAt)}
          />
        ))}
        {recommends?.stickers?.map((sticker) => (
          <AssetItem
            key={sticker.id}
            image={sticker.url}
            name={sticker.name}
            author={sticker.author.username}
            date={stringOfDate(sticker.createdAt)}
          />
        ))}
      </Flex>
    </Card>
  );
}

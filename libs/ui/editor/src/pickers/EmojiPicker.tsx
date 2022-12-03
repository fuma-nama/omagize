import {
  Popover,
  PopoverBody,
  PopoverContent,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { ReactNode, useState } from 'react';
import { CustomEmojiPicker } from './CustomEmojiPicker';
import UnicodeEmojiPicker from './UnicodeEmojiPicker';
import { Editor } from 'slate';
import { TabButton } from '@omagize/ui/components';
import { insertEmoji } from '../plugins';

export function EmojiPicker({ editor, children }: { editor: Editor; children: ReactNode }) {
  const [index, setIndex] = useState<number>(0);

  return (
    <Popover isLazy placement="top">
      {children}
      <PopoverContent>
        <PopoverBody p={0}>
          <Tabs index={index} onChange={setIndex} isLazy>
            <TabList>
              <TabButton>Built-in</TabButton>
              <TabButton>Custom</TabButton>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                <UnicodeEmojiPicker onSelect={(emoji) => insertEmoji(editor, emoji)} />
              </TabPanel>
              <TabPanel p={0}>
                <CustomEmojiPicker editor={editor} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

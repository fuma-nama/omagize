import { Button, ButtonGroup, Hide, IconButton, Show } from '@chakra-ui/react';
import { Fragment, ReactElement } from 'react';
import { ValueProps } from 'components/editor/MessageInput';
import { DraftInlineStyleType, RichUtils } from 'draft-js';
import { useColors } from 'variables/colors';
import {
  BiBold,
  BiCode,
  BiItalic,
  BiStrikethrough,
  BiUnderline,
} from 'react-icons/bi';

const styles: Array<{
  style: DraftInlineStyleType;
  label: string;
  icon?: ReactElement;
}> = [
  {
    style: 'BOLD',
    label: 'Bold',
    icon: <BiBold />,
  },
  { style: 'ITALIC', label: 'Italic', icon: <BiItalic /> },
  {
    style: 'CODE',
    label: 'Code',
    icon: <BiCode />,
  },
  {
    style: 'STRIKETHROUGH',
    label: 'Strike Through',
    icon: <BiStrikethrough />,
  },
  {
    style: 'UNDERLINE',
    label: 'Underline',
    icon: <BiUnderline />,
  },
];

export function Toolbar({ value, onChange }: ValueProps) {
  const style = value.getCurrentInlineStyle();
  const { brand, globalBg } = useColors();
  const toggleStyle = (style: DraftInlineStyleType) => {
    onChange(RichUtils.toggleInlineStyle(value, style));
  };

  return (
    <ButtonGroup w="full" bg={globalBg} rounded="2xl" p={1} spacing={1}>
      {styles.map((s) => {
        const checked = style?.contains(s.style);
        const onMouseDown = (e: any) => {
          e.preventDefault();
          toggleStyle(s.style);
        };

        return (
          <Fragment key={s.style}>
            <Show above="md">
              <Button
                onMouseDown={onMouseDown}
                color={checked && 'white'}
                bg={checked && brand}
                _hover={{}}
                leftIcon={s.icon}
              >
                {s.label}
              </Button>
            </Show>
            <Hide above="md">
              <IconButton
                aria-label={s.style}
                onMouseDown={onMouseDown}
                color={checked && 'white'}
                bg={checked && brand}
                icon={s.icon}
                _hover={{}}
              />
            </Hide>
          </Fragment>
        );
      })}
    </ButtonGroup>
  );
}

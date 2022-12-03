import { ButtonGroup, IconButton, Tooltip } from '@chakra-ui/react';
import { useColors } from '@omagize/ui/theme';
import { ReactElement } from 'react';
import { BiBold, BiCode, BiItalic, BiStrikethrough, BiUnderline } from 'react-icons/bi';
import { Editor } from 'slate';
import { TextMarks } from './types';

export function toggleFormat(editor: Editor, format: keyof TextMarks) {
  const isActive = isFormatActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

function isFormatActive(editor: Editor, format: keyof TextMarks) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

const styles: Array<{
  style: keyof TextMarks;
  label: string;
  icon?: ReactElement;
}> = [
  {
    style: 'bold',
    label: 'Bold',
    icon: <BiBold />,
  },
  { style: 'italic', label: 'Italic', icon: <BiItalic /> },
  {
    style: 'code',
    label: 'Code',
    icon: <BiCode />,
  },
  {
    style: 'strikethrough',
    label: 'Strike Through',
    icon: <BiStrikethrough />,
  },
  {
    style: 'underlined',
    label: 'Underline',
    icon: <BiUnderline />,
  },
];

export function Toolbar({ editor }: { editor: Editor }) {
  const { brand, globalBg } = useColors();

  return (
    <ButtonGroup w="full" bg={globalBg} rounded="2xl" p={1} spacing={1}>
      {styles.map((s) => {
        const checked = isFormatActive(editor, s.style);
        const onMouseDown = (e: any) => {
          e.preventDefault();
          toggleFormat(editor, s.style);
        };

        return (
          <Tooltip key={s.style} label={s.label}>
            <IconButton
              aria-label={s.style}
              onMouseDown={onMouseDown}
              color={checked && 'white'}
              bg={checked && brand}
              icon={s.icon}
              _hover={{}}
            />
          </Tooltip>
        );
      })}
    </ButtonGroup>
  );
}

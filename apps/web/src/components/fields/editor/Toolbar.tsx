import { Button, ButtonGroup } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { ValueProps } from 'components/fields/MessageInput';
import { DraftInlineStyleType, RichUtils } from 'draft-js';
import { useColors } from 'variables/colors';
import { BiCodeBlock, BiItalic } from 'react-icons/bi';

export function Toolbar({ value, onChange }: ValueProps) {
  const style = value.getCurrentInlineStyle();
  const { brand, globalBg } = useColors();
  const toggleStyle = (style: DraftInlineStyleType) => {
    onChange(RichUtils.toggleInlineStyle(value, style));
  };

  const styles: Array<{
    style: DraftInlineStyleType;
    label: string;
    icon?: ReactElement;
  }> = [
    {
      style: 'BOLD',
      label: 'Bold',
    },
    { style: 'ITALIC', label: 'Italic', icon: <BiItalic /> },
    {
      style: 'CODE',
      label: 'Code Block',
      icon: <BiCodeBlock />,
    },
  ];

  return (
    <ButtonGroup bg={globalBg}>
      {styles.map((s) => {
        const checked = style?.contains(s.style);

        return (
          <Button
            key={s.style}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleStyle(s.style);
            }}
            color={checked && 'white'}
            bg={checked && brand}
            variant="outline"
            _hover={{}}
            leftIcon={s.icon}
          >
            {s.label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}

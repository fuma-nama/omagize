import { Select } from 'chakra-react-select';
import { Props } from 'react-select/dist/declarations/src/Select';
import { GroupBase, SelectInstance } from 'react-select';
import { RefAttributes } from 'react';
import { useColors } from '@omagize/ui/theme';

export default function StyledSelect<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  portal,
  ...rest
}: {
  portal?: boolean;
} & Partial<
  Props<Option, IsMulti, Group> & RefAttributes<SelectInstance<Option, IsMulti, Group>>
>) {
  const { brand, cardBg } = useColors();

  return (
    <Select
      {...(rest as any)}
      styles={{
        menuPortal: (provided) => ({
          ...provided,
          zIndex: '1500',
        }),
      }}
      menuPortalTarget={portal && document.body}
      focusBorderColor={brand}
      chakraStyles={{
        option: (provided, state) => ({
          ...provided,
          bg: state.isSelected ? brand : provided.bg,
        }),
        menuList: (provided) => ({
          ...provided,
          bg: cardBg,
        }),
      }}
    />
  );
}

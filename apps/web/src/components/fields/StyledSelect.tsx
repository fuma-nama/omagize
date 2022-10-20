import { useColors } from '../../variables/colors';
import { Select } from 'chakra-react-select';
import { Props } from 'react-select/dist/declarations/src/Select';
import { GroupBase, SelectInstance } from 'react-select';
import { RefAttributes } from 'react';

export default function StyledSelect<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  portal,
  ...props
}: Partial<
  Props<Option, IsMulti, Group> &
    RefAttributes<SelectInstance<Option, IsMulti, Group>>
> & {
  portal?: boolean;
}) {
  const { brand, cardBg } = useColors();

  return (
    <Select
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
      {...props}
    />
  );
}

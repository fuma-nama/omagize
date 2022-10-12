import { useColors } from '../../variables/colors';
import { Select } from 'chakra-react-select';
import { Props } from 'react-select/dist/declarations/src/Select';
import { GroupBase, SelectInstance } from 'react-select';
import { RefAttributes } from 'react';

export default function StyledSelect<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: Partial<
    Props<Option, IsMulti, Group> &
      RefAttributes<SelectInstance<Option, IsMulti, Group>>
  >
) {
  const { brand, cardBg } = useColors();

  return (
    <Select
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

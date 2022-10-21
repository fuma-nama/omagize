import { useRef } from 'react';
import { FilePicker } from 'utils/ImageUtils';

export default function useFilePicker(onChange: (file: File) => void) {
  const ref = useRef<HTMLInputElement>();

  return {
    pick: () => ref.current.click(),
    component: <FilePicker inputRef={ref} onChange={onChange} />,
  };
}

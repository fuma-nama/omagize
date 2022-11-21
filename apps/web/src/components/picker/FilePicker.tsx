import { Reset } from '@omagize/api';
import { InputHTMLAttributes, LegacyRef, useRef } from 'react';
import { useImageUrl } from 'utils/ImageUtils';

export default function useFilePicker(onChange: (file: File) => void) {
  const ref = useRef<HTMLInputElement>();

  return {
    pick: () => ref.current.click(),
    component: <FilePicker inputRef={ref} onChange={(files) => onChange(files[0])} />,
  };
}

export function useFilePickerUrl<T extends Blob | Reset>(
  value: T,
  onChange: (file: Blob) => void,
  props?: InputHTMLAttributes<HTMLInputElement>
) {
  const ref = useRef<HTMLInputElement>();
  const url = useImageUrl(value);

  return {
    select() {
      ref.current.click();
    },
    picker: <FilePicker inputRef={ref} onChange={(files) => onChange(files[0])} input={props} />,
    url,
  };
}

export function FilePicker(props: {
  onChange: (file: FileList) => void;
  inputRef: LegacyRef<HTMLInputElement>;
  input?: InputHTMLAttributes<HTMLInputElement>;
}) {
  const { inputRef, onChange, input } = props;

  return (
    <input
      type="file"
      ref={inputRef}
      value={[]}
      onChange={(e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          onChange(files);
        }
      }}
      hidden
      {...input}
    />
  );
}

import { InputHTMLAttributes, LegacyRef, useMemo, useRef } from 'react';
import { Reset } from '@omagize/api';
import { Crop } from 'react-image-crop';

export const AvatarFormat: Format = {
  maxWidth: 500,
  maxHeight: 500,
  aspect: 1,
};
export const BannerFormat: Format = {
  maxWidth: 1500,
  maxHeight: 800,
  aspect: 1500 / 800,
};

export const EmojiFormat: Format = {
  maxWidth: 50,
  maxHeight: 50,
  aspect: 1,
};

export const StickerFormat: Format = {
  maxWidth: 100,
  maxHeight: 100,
  aspect: 1,
};

export type UploadImage = Blob;
export type Format = {
  aspect?: number;
  maxWidth: number;
  maxHeight: number;
};
export const supportedImageTypes = '.png, .jpg, .jpeg, .gif';
export function url(initial: string, image?: string | Reset): string {
  if (image == null || image === 'reset') return initial;

  return image;
}

export function resizeImage(image: File | Blob, format: Format): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const imageObj = new Image();
  imageObj.src = URL.createObjectURL(image);

  return new Promise((r) => {
    imageObj.onload = () => {
      resizeImageBase(canvas, context, imageObj, format);
      canvas.toBlob((b) => r(b));
    };
  });
}

export function cropImage(
  crop: Crop | null,
  imageObj: HTMLImageElement,
  format: Format
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (crop != null) {
    canvas.width = Math.min(crop?.width ?? imageObj.naturalWidth, format.maxWidth);
    canvas.height = Math.min(crop?.height ?? imageObj.naturalHeight, format.maxHeight);
    const scaleX = imageObj.naturalWidth / imageObj.width;
    const scaleY = imageObj.naturalHeight / imageObj.height;
    /*
        const ratio = format.aspect
        const inputRatio = canvas.width / canvas.height;
        console.log(ratio === inputRatio)

        You can check if ratio doesn't match, we will skip this part
         */

    context.drawImage(
      imageObj,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
  } else {
    resizeImageBase(canvas, context, imageObj, format);
  }

  return new Promise((r) => canvas.toBlob((b) => r(b)));
}

function resizeImageBase(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  imageObj: HTMLImageElement,
  format: Format
) {
  const ratio = format.aspect;
  canvas.width = Math.min(imageObj.naturalWidth, format.maxWidth);
  canvas.height = Math.min(imageObj.naturalHeight, format.maxHeight);
  const inputRatio = canvas.width / canvas.height;

  if (ratio != null) {
    if (inputRatio > ratio) {
      canvas.width *= ratio;
    } else if (inputRatio < ratio) {
      canvas.height /= ratio;
    }
  }

  context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
}

export function useImagePickerResize<T extends UploadImage | Reset>(
  value: T,
  onChange: (file: T) => void,
  format: Format,
  props: InputHTMLAttributes<HTMLInputElement> | null = {
    accept: supportedImageTypes,
  }
) {
  const base = useImagePickerBase(value, onChange);

  return {
    ...base,
    picker: (
      <FilePicker
        {...props}
        onChange={(file: File) => {
          resizeImage(file, format).then((result) => onChange(result as T));
        }}
        inputRef={base.ref}
      />
    ),
  };
}

export function useImagePickerBase<T extends UploadImage | Reset>(
  value: T,
  onChange: (file: T) => void
) {
  const ref = useRef<HTMLInputElement>();
  const url = useImageUrl(value);

  return {
    value,
    setValue: onChange,
    select() {
      ref.current.click();
    },
    ref,
    url,
  };
}

export function FilePicker(props: {
  onChange: (file: File) => void;
  inputRef: LegacyRef<HTMLInputElement>;
}) {
  const { inputRef, onChange, ...rest } = props;

  return (
    <input
      type="file"
      ref={inputRef}
      value={[]}
      onChange={(e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          onChange(files[0]);
        }
      }}
      hidden
      {...rest}
    />
  );
}

export function useImageUrl(file: UploadImage | Reset) {
  return useMemo(() => {
    if (!file || file === 'reset') return null;
    return URL.createObjectURL(file);
  }, [file]);
}

export function readFileToUrl(file: File) {
  return new Promise<string>((r, reject) => {
    const reader = new FileReader();
    // it's onload event and you forgot (parameters)

    reader.onload = () => r(reader.result as string);
    reader.onerror = () => reject(reader.error);
    // you have to declare the file loading
    reader.readAsDataURL(file);
  });
}

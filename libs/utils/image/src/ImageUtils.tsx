import { useMemo } from 'react';
import { Reset } from '@omagize/api';

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

export function useImageUrl(file: UploadImage | Reset) {
  return useMemo(() => {
    if (file instanceof Blob) {
      return URL.createObjectURL(file);
    } else {
      return null;
    }
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

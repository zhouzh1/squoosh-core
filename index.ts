/**
 * squoosh app core code related to image compression
 */

import {
  builtinDecode,
  sniffMimeType,
} from './utils';
import encoderMap from './lib/encoder-map';
import quantizeProcess from './lib/quantize';

/**
 * 根据图片的mime类型选择对应的编码库
 * @param {string} mimeType 图片的mime类型
 */
function getEncoderKey(mimeType: string): string {
  switch (mimeType) {
    case 'image/png':
      return 'oxiPNG';
    case 'image/jpeg':
      return 'mozJPEG';
    default:
      return '';
  }
}

/**
 * 
 * @param file 
 */
export async function compress(file: File): Promise<File> {
  const mimeType = await sniffMimeType(file);
  const imageData = await builtinDecode(file);
  const quantized = await quantizeProcess(imageData);
  const encoderKey = getEncoderKey(mimeType);
  const encoder = encoderMap[encoderKey];
  if (encoder) {
    const compressedData = await encoder.encode(quantized);
    return new File(
      [compressedData],
      file.name.replace(/.[^.]*$/, `.${encoder.extension}`),
      { type: encoder.mimeType },
    );
  } else {
    console.error('lack of corresponding encoder!');
  }
}
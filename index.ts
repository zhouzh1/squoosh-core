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
 * @param {string} mimeType 图片的mime类型 
 */
function getEncoderWasm(mimeType: string, options: CompressOptions): string {
  switch (mimeType) {
    case 'image/png':
      return options.pngenc_wasm_url;
    case 'image/jpeg':
      return options.jpegenc_wasm_url;
    default:
      return '';
  }
}

interface CompressOptions {
  imagequant_wasm_url: string,
  jpegenc_wasm_url: string,
  pngenc_wasm_url: string,
}

/**
 * 
 * @param file 
 */
export async function compress(file: File, options: CompressOptions): Promise<File> {
  const { imagequant_wasm_url } = options || {};
  const mimeType = await sniffMimeType(file);
  const imageData = await builtinDecode(file);
  // const quantized = imageData;
  const quantized = await quantizeProcess(imageData, imagequant_wasm_url);
  const encoderKey = getEncoderKey(mimeType);
  const encoder = encoderMap[encoderKey];
  if (encoder) {
    const wasmUrl = getEncoderWasm(mimeType, options);
    const compressedData = await encoder.encode(quantized, wasmUrl);
    return new File(
      [compressedData],
      file.name.replace(/.[^.]*$/, `.${encoder.extension}`),
      { type: encoder.mimeType },
    );
  } else {
    console.error(`目前暂不支持压缩${mimeType}格式的图片`);
    return file;
  }
}
import mozjpeg_enc, {
    EncodeOptions,
    MozJpegColorSpace,
    MozJPEGModule,
} from '../codecs/mozjpeg_enc/mozjpeg_enc';
import {
    initEmscriptenModule,
} from '../utils';
// import wasmUrl from '../codecs/mozjpeg_enc/mozjpeg_enc.wasm';
// @debug
const wasmUrl = './dist/mozjpeg_enc.wasm';

export { EncodeOptions, MozJpegColorSpace };

export const label = 'MozJPEG';
export const mimeType = 'image/jpeg';
export const extension = 'jpg';
export const defaultOptions: EncodeOptions = {
  quality: 75,
  baseline: false,
  arithmetic: false,
  progressive: true,
  optimize_coding: true,
  smoothing: 0,
  color_space: MozJpegColorSpace.YCbCr,
  quant_table: 3,
  trellis_multipass: false,
  trellis_opt_zero: false,
  trellis_opt_table: false,
  trellis_loops: 1,
  auto_subsample: true,
  chroma_subsample: 2,
  separate_chroma_quality: false,
  chroma_quality: 75,
};

let emscriptenModule: Promise<MozJPEGModule>;

export async function encode(data: ImageData, options?: EncodeOptions,): Promise<ArrayBuffer> {
  if (!emscriptenModule) {
    emscriptenModule = initEmscriptenModule(mozjpeg_enc, wasmUrl);
  }
  options = options || defaultOptions;
  const module = await emscriptenModule;
  const resultView = module.encode(data.data, data.width, data.height, options);
  // wasm can’t run on SharedArrayBuffers, so we hard-cast to ArrayBuffer.
  return resultView.buffer as ArrayBuffer;
}
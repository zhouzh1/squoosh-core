import imagequant, { QuantizerModule } from '../codecs/imagequant/imagequant';
import { initEmscriptenModule } from '../utils';

// import wasmUrl from 'url:codecs/imagequant/imagequant.wasm';
// @debug
const wasmUrl = './dist/imagequant.wasm';

let emscriptenModule: Promise<QuantizerModule>;

export interface Options {
    zx: number;
    maxNumColors: number;
    dither: number;
}
  
export const defaultOptions: Options = {
    zx: 0,
    maxNumColors: 256,
    dither: 1.0,
};

export default async function process(
  data: ImageData,
  opts: Options = defaultOptions,
): Promise<ImageData> {
  if (!emscriptenModule) {
    emscriptenModule = initEmscriptenModule(imagequant, wasmUrl);
  }

  const module = await emscriptenModule;

  const result = opts.zx
    ? module.zx_quantize(data.data, data.width, data.height, opts.dither)
    : module.quantize(
        data.data,
        data.width,
        data.height,
        opts.maxNumColors,
        opts.dither,
      );

  return new ImageData(result, data.width, data.height);
}
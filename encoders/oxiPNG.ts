import initOxiWasmST, {
    optimise as optimiseST,
} from '../codecs/oxipng/pkg/squoosh_oxipng';
import {
    canvasEncode,
    blobToArrayBuffer,
} from '../utils';

export interface EncodeOptions {
    level: number;
}
  
export const label = 'OxiPNG';
export const mimeType = 'image/png';
export const extension = 'png';

export const defaultOptions: EncodeOptions = {
    level: 3,
};

async function initST(wasmUrl) {
    await initOxiWasmST(wasmUrl);
    return optimiseST;
}

let wasmReady: Promise<typeof optimiseST>;

export async function encode(imageData: ImageData, wasmUrl: string, options: EncodeOptions = defaultOptions) {
    const pngBlob = await canvasEncode(imageData, 'image/png');
    const pngBuffer = await blobToArrayBuffer(pngBlob);
    if (!wasmReady) {
        wasmReady = initST(wasmUrl);
    }
    const optimise = await wasmReady;
    return optimise(new Uint8Array(pngBuffer), options.level).buffer;
}
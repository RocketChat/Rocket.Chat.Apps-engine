import { Decoder, Encoder, ExtensionCodec } from '@msgpack/msgpack';

const extensionCodec = new ExtensionCodec();

extensionCodec.register({
    type: 0,
    encode: (object: unknown) => {
        // We don't care about functions, but also don't want to throw an error
        if (typeof object === 'function') {
            return new Uint8Array([0]);
        }
    },
    decode: (_data: Uint8Array) => undefined,
});

// We need to handle Buffers because Deno needs its own decoding
extensionCodec.register({
    type: 1,
    encode: (object: unknown) => {
        if (object instanceof Buffer) {
            return new Uint8Array(object.buffer, object.byteOffset, object.byteLength);
        }
    },
    // By passing byteOffset and byteLength, we're creating a view of the original buffer instead of copying it
    decode: (data: Uint8Array) => Buffer.from(data.buffer, data.byteOffset, data.byteLength),
});

export const encoder = new Encoder({ extensionCodec });
export const decoder = new Decoder({ extensionCodec });

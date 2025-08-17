import { fromByteArray, toByteArray } from "base64-js";

export const toB64 = (u8: Uint8Array) => fromByteArray(u8);
export const fromB64 = (b64: string) => toByteArray(b64);

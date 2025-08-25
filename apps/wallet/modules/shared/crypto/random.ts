import * as ExpoCrypto from "expo-crypto";

export async function randomBytesAsync(len: number): Promise<Uint8Array> {
  const arr = await ExpoCrypto.getRandomBytesAsync(len);
  return Uint8Array.from(arr);
}

export function randomBytes(len: number): Uint8Array {
  const arr = ExpoCrypto.getRandomBytes(len);
  return Uint8Array.from(arr);
}

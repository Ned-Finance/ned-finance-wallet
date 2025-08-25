// modules/keyring/shared/pin-vault.ts

import { secureStore } from "@/modules/shared/secure-store";
import type { WrappedMK } from "../types";
import { unwrapMKWithPin, wrapMKWithPin } from "./crypto";

const WRAPPED_MK_KEY = "ned:keyring:wrapped-mk:v1";

export async function hasPinConfigured(): Promise<boolean> {
  return !!(await secureStore.getItem(WRAPPED_MK_KEY));
}

export async function setPinAndWrapMK(
  pin: string,
  masterKey: Uint8Array
): Promise<void> {
  const wrapped = await wrapMKWithPin(masterKey, pin);
  await secureStore.setItem(WRAPPED_MK_KEY, JSON.stringify(wrapped));
}

export async function unlockWithPin(pin: string): Promise<Uint8Array> {
  const raw = await secureStore.getItem(WRAPPED_MK_KEY);
  if (!raw) throw new Error("No PIN configured");
  const wrapped = JSON.parse(raw) as WrappedMK;
  return unwrapMKWithPin(wrapped, pin);
}

export async function changePin(oldPin: string, newPin: string): Promise<void> {
  const mk = await unlockWithPin(oldPin);
  try {
    await setPinAndWrapMK(newPin, mk);
  } finally {
    mk.fill(0);
  }
}

export async function clearPinAndWrappedMK(): Promise<void> {
  await secureStore.deleteItem(WRAPPED_MK_KEY);
}

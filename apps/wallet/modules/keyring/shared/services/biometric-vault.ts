import {
  authenticateBiometric,
  isBiometricAvailable,
} from "@/modules/shared/biometrics";
import { fromB64, toB64 } from "@/modules/shared/crypto/base64";
import { secureStore } from "@/modules/shared/secure-store";

const BIO_MK_KEY = "ned:keyring:mk:bio:v1";
const BIO_FLAG = "ned:keyring:mk:bio:enabled";

/**
 * Returns true if the user enabled biometric unlock for MK on this device.
 * (Independent from hardware availability—which can change.)
 */
export async function isBiometricEnabled(): Promise<boolean> {
  const flag = await secureStore.getItem(BIO_FLAG);
  return flag === "1";
}

/**
 * Enables biometric unlock by storing a copy of MK under biometric protection.
 * - iOS: setItemBiometric binds to Face/Touch ID.
 * - Android: we store normally and will require a biometric prompt before reading.
 * Requires MK to be already in memory (unlocked by PIN).
 */
export async function enableBiometricUnlock(mk: Uint8Array): Promise<void> {
  const { available, enrolled } = await isBiometricAvailable();
  if (!available || !enrolled) throw new Error("Biometrics not available");

  const mkB64 = toB64(mk);
  await secureStore.setItemBiometric(BIO_MK_KEY, mkB64);
  await secureStore.setItem(BIO_FLAG, "1");
}

/**
 * Disables biometric unlock and removes the stored copy.
 */
export async function disableBiometricUnlock(): Promise<void> {
  await secureStore.deleteItem(BIO_MK_KEY);
  await secureStore.deleteItem(BIO_FLAG);
}

/**
 * Tries to unlock the MK using biometrics only.
 * - iOS: getItemBiometric will trigger the OS prompt.
 * - Android: we *first* prompt explicitly, then read.
 * Returns the MK (Uint8Array) on success, or null otherwise.
 */
export async function tryUnlockWithBiometrics(): Promise<Uint8Array | null> {
  const enabled = await isBiometricEnabled();
  if (!enabled) return null;

  // Prompt user (no-op on iOS if getItemBiometric already prompts? We prompt anyway for Android.)
  const auth = await authenticateBiometric("Unlock wallet");
  if (!auth.success) return null;

  const mkB64 = await secureStore.getItemBiometric(BIO_MK_KEY);
  if (!mkB64) return null;

  return fromB64(mkB64);
}

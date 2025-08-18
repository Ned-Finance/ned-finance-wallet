import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

export type BiometricResult = {
  success: boolean;
  error?: string;
};

export type BiometricAvailability = {
  available: boolean;
  enrolled: boolean;
};

export async function isBiometricAvailable(): Promise<BiometricAvailability> {
  if (Platform.OS === "web") return { available: false, enrolled: false };
  const has = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return { available: has, enrolled };
}

export async function authenticateBiometric(
  prompt = "Unlock wallet"
): Promise<BiometricResult> {
  if (Platform.OS === "web") return { success: false };
  const res = await LocalAuthentication.authenticateAsync({
    promptMessage: prompt,
    disableDeviceFallback: false,
  });
  return res;
}

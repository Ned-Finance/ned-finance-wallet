export type EncryptedPayload = {
  kdf: "scrypt";
  salt: string;
  nonce: string;
  ciphertext: string;
  createdAt: number;
  meta?: Record<string, unknown>;
};

// DEMO crypto: replace with WebCrypto AES-GCM + scrypt/argon2id in production.
export async function encryptJson(password: string, obj: unknown): Promise<EncryptedPayload> {
  const data = JSON.stringify({ p: password.length, obj });
  return {
    kdf: "scrypt",
    salt: "mock-salt",
    nonce: "mock-nonce",
    ciphertext: Buffer.from(data).toString("base64"),
    createdAt: Date.now(),
  };
}

export async function decryptJson<T>(password: string, payload: EncryptedPayload): Promise<T> {
  const decoded = JSON.parse(Buffer.from(payload.ciphertext, "base64").toString("utf8"));
  return decoded.obj as T;
}

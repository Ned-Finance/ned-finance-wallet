import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { useCallback, useState } from "react";

export function useMnemonic() {
  const [mnemonic, setMnemonic] = useState<string>("");

  const generate = useCallback(() => {
    const entropy = crypto.getRandomValues(new Uint8Array(16)); // 128 bits
    const mnemonic = bip39.entropyToMnemonic(entropy, wordlist);
    setMnemonic(mnemonic);
    return mnemonic;
  }, []);

  const validate = useCallback((phrase: string) => {
    return bip39.validateMnemonic(phrase, wordlist);
  }, []);

  return {
    mnemonic,
    generate,
    validate,
  };
}

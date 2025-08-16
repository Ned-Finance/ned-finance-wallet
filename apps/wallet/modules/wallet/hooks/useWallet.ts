import { Account } from "@ned-finance/wallet";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { useCallback, useState } from "react";

export function useWallet() {
  const [keypair, setKeypair] = useState<Account>("");

  const generate = useCallback(() => {
    const entropy = crypto.getRandomValues(new Uint8Array(16)); // 128 bits
    const keypair = bip39.entropyToMnemonic(entropy, wordlist);
    setKeypair(keypair);
    return keypair;
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

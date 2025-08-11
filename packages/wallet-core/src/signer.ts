import type { Address, ChainId } from "./types";

export interface Signer {
  chainId: ChainId;
  getAddress(): Promise<Address>;
  signMessage(msg: Uint8Array): Promise<Uint8Array>;
  signTransaction(unsignedTx: Uint8Array): Promise<Uint8Array>;
}

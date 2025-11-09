import type { AddressLike, ethers } from "ethers";

export interface Bid {
  address: AddressLike;
  amount: ethers.BigNumberish;
}

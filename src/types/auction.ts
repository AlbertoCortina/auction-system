import type { AddressLike, ethers } from "ethers";
import type { Bid } from "@/types/bid.ts";

export interface Auction {
  id: number;
  name: string;
  deadline: Date;
  owner: AddressLike;
  highestBid: ethers.BigNumberish;
  highestBidder: AddressLike;
  bids: Bid[];
}

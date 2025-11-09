import { type AddressLike, ethers } from "ethers";

export const shortenAddress = (address: AddressLike): string => {
  if (typeof address !== "string") {
    return "—";
  }

  const addrStr = address.trim();

  return `${addrStr.slice(0, 6)}...${addrStr.slice(-4)}`;
};

/**
 * Formats a balance value into a human-readable string.
 * Accepts BigInt, string, or number in Wei or Ether.
 *
 * @param balance - The raw balance (in Wei or Ether)
 * @param decimals - Number of decimal places to keep (default = 4)
 * @param currency - Optional symbol (e.g. 'ETH', 'BNB')
 * @returns Formatted balance string like "1.2345 ETH"
 */
export const formatBalance = (
  balance: ethers.BigNumberish,
  decimals: number = 4,
  currency?: string,
): string => {
  try {
    // Convert to string so ethers can handle it
    const formatted = ethers.formatEther(balance);
    const rounded = Number(formatted).toFixed(decimals);
    const withCommas = Number(rounded).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return currency ? `${withCommas} ${currency}` : withCommas;
  } catch (error) {
    console.error("Failed to format balance:", error);
    return "0.0000";
  }
};

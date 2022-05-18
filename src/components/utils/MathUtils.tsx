import { BigNumber, ethers } from "ethers";
import { PLATFORM_COMISSION } from "../../constants";

export function calculatePotentialEarnings(
  winBetTotal: BigNumber,
  loseBetTotal: BigNumber,
  betAmount: BigNumber
): Number {
  const winnersTotal = Number(ethers.utils.formatEther(winBetTotal));
  const losersTotal =
    Number(ethers.utils.formatEther(loseBetTotal)) * (1 - PLATFORM_COMISSION);
  const bet = Number(ethers.utils.formatEther(betAmount));

  return bet + (bet / winnersTotal) * losersTotal;
}

export function greatestCommonDivisor(a: number, b: number): number {
  return b !== 0 ? greatestCommonDivisor(b, a % b) : a;
}

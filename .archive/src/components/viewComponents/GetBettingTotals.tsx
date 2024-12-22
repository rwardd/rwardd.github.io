import { BigNumber, ethers } from "ethers";
import { Spinner, Text } from "grommet";
import React, { useContext, useEffect, useState, FC } from "react";
import { REFRESH_RATE } from "../../constants";
import { GlobalState } from "../../globalState";
import { Bet, BettingOdds } from "../../types";
import {
  calculatePotentialEarnings,
  greatestCommonDivisor,
} from "../utils/MathUtils";

interface GetOddsProps {
  fixtureId: BigNumber;
}

interface GetPotentialEarningsProps {
  fixtureId: BigNumber;
  bet: Bet;
}

async function _getBettingTotals(
  bettingContract: ethers.Contract,
  fixtureId: BigNumber
) {
  return await bettingContract.getBettingTotals(fixtureId);
}

export const GetOdds: FC<GetOddsProps> = (props) => {
  const { fixtureId } = props;
  const { bettingContract } = useContext(GlobalState);
  const [odds, setOdds] = useState<undefined | BettingOdds>(undefined);

  /**
   * This function will try to reduce the odds down to the simplest fraction.
   *
   * This calculation get tricky with decimals so we have floored the value
   * of the bets first. This will mean that the odds are always under estimated.
   */
  function processBettingOdds(home: BigNumber, away: BigNumber): BettingOdds {
    const _home = Math.floor(Number(ethers.utils.formatEther(home)));
    const _away = Math.floor(Number(ethers.utils.formatEther(away)));

    const gcd =
      _home === 0 || _away === 0 ? 1 : greatestCommonDivisor(_home, _away);

    return { homeBets: _home / gcd, awayBets: _away / gcd };
  }

  async function getBettingOdds() {
    let bettingTotals;

    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      bettingTotals = await _getBettingTotals(bettingContract, fixtureId);
    }

    // Reduce ratio
    const formattedOdds = processBettingOdds(
      bettingTotals.home,
      bettingTotals.away
    );

    setOdds(formattedOdds);
  }

  useEffect(() => {
    // Refresh every second
    const interval = setInterval(() => getBettingOdds(), REFRESH_RATE);
    return () => {
      clearInterval(interval);
    };
  });

  if (!odds) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Spinner />
      </div>
    );
  } else {
    return <div>{`${odds.homeBets}:${odds.awayBets}`}</div>;
  }
};

export const GetPotentialEarnings: FC<GetPotentialEarningsProps> = (props) => {
  const { fixtureId, bet } = props;
  const { bettingContract } = useContext(GlobalState);
  const [earnings, setEarnings] = useState<undefined | Number>(undefined);

  useEffect(() => {
    // Refresh every second
    const interval = setInterval(() => estimateEarnings(), REFRESH_RATE);
    return () => {
      clearInterval(interval);
    };
  });

  /**
   * This function will try to estimate the earnings of a game
   */
  async function estimateEarnings() {
    // Skip estimation if payOut is known
    if (bet.invalidated || bet.payOut.isNegative()) {
      setEarnings(Number(ethers.utils.formatEther(bet.amount)));
      return;
    }

    // Get betting totals
    let bettingTotals;
    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      bettingTotals = await _getBettingTotals(bettingContract, fixtureId);
    }

    // Calculate potential earnings
    const potetialEarnings =
      bet.team === (await bettingContract.getFixture(Number(bet.fixId))).home
        ? calculatePotentialEarnings(
            bettingTotals.home,
            bettingTotals.away,
            bet.amount
          )
        : calculatePotentialEarnings(
            bettingTotals.away,
            bettingTotals.home,
            bet.amount
          );

    setEarnings(potetialEarnings);
  }

  function getDisplayOptions(earnings: Number): [color: string, sign: string] {
    if (earnings > 0) {
      return ["status-ok", "+"];
    } else if (earnings === 0) {
      return ["status-warning", ""];
    } else {
      return ["status-error", "-"];
    }
  }

  if (earnings === undefined) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Spinner />
      </div>
    );
  } else if (bet.invalidated) {
    return <Text color='status-disabled'>Bet invalidated</Text>;
  } else {
    const [color, sign] = getDisplayOptions(earnings);

    return (
      <Text color={color} weight='bold'>{`${sign}${earnings.toFixed(
        1
      )} ETH`}</Text>
    );
  }
};

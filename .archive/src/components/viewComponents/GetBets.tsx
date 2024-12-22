import { useContext, useEffect, useState } from "react";
import { REFRESH_RATE } from "../../constants";
import { GlobalState } from "../../globalState";
import { Bet } from "../../types";

type BetsHook = [bets: Bet[] | null, refresh: () => void];

// Returns a hook that returns bets and refresh function
const GetBets = (): BetsHook => {
  const { bettingContract } = useContext(GlobalState);
  const [userBets, setUserBets] = useState<any[] | null>(null);

  async function _getUserBets() {
    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      let userBets = [];
      const userBetIds = await bettingContract.getUserBets();

      for (let i = 0; i < userBetIds.length; i++) {
        userBets.push(await bettingContract.getBet(userBetIds[i]));
      }

      setUserBets(userBets);
    }
  }

  useEffect(() => {
    // Refresh every second
    const interval = setInterval(() => _getUserBets(), REFRESH_RATE);
    return () => {
      clearInterval(interval);
    };
  });

  return [userBets, _getUserBets];
};

export default GetBets;

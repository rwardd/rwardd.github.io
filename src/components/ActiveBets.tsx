import { ethers } from "ethers";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "grommet";
import React, { FC } from "react";
import { Bet } from "../types";
import RetrieveFunds from "./transactionComponents/RetrieveFunds";
import { GetPotentialEarnings } from "./viewComponents/GetBettingTotals";

interface ActiveBetsProps {
  userBets: Bet[] | null;
  refreshBets: () => void;
}

const ActiveBets: FC<ActiveBetsProps> = (props) => {
  const { userBets, refreshBets } = props;

  const filteredActiveBets = userBets?.filter((bet) => !bet.payedOut);

  function tableData() {
    const betData = filteredActiveBets?.map((bet: Bet) => {
      const { betId, team, amount, fixId } = bet;

      const formattedAmount = ethers.utils.formatEther(amount);

      return (
        <TableRow key={betId.toString()}>
          <TableCell>{team}</TableCell>
          <TableCell align='center'>{formattedAmount}</TableCell>
          <TableCell align='center'>
            <GetPotentialEarnings fixtureId={fixId} bet={bet} />
          </TableCell>
          <TableCell align='center'>
            <RetrieveFunds bet={bet} refreshBets={refreshBets} />
          </TableCell>
        </TableRow>
      );
    });

    return <TableBody>{betData}</TableBody>;
  }

  function tableHeader() {
    let columns = ["Team", "Amount", "Potential Earnings", "Result"];

    const tableCells = columns.map((columnTitle) => {
      const align = columnTitle === columns[0] ? "left" : "center";

      return (
        <TableCell scope='col' border='bottom' key={columnTitle} align={align}>
          {columnTitle}
        </TableCell>
      );
    });

    return (
      <TableHeader>
        <TableRow>{tableCells}</TableRow>
      </TableHeader>
    );
  }

  function table() {
    return (
      <Table>
        {tableHeader()}
        {tableData()}
      </Table>
    );
  }

  if (userBets === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Spinner size='xlarge' />
      </div>
    );
  }
  return (
    <div style={{ marginBottom: "15px" }}>
      {filteredActiveBets?.length === 0
        ? "You don't have any active bets"
        : table()}
    </div>
  );
};

export default ActiveBets;

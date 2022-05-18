import { BigNumber, ethers } from "ethers";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from "grommet";
import { Checkmark, Clear, Close } from "grommet-icons";
import React, { FC } from "react";
import { Bet } from "../types";

interface InactiveBetsProps {
  userBets: Bet[] | null;
}

const InactiveBets: FC<InactiveBetsProps> = (props) => {
  const { userBets } = props;

  const inactiveBets = userBets?.filter((bet) => bet.payedOut);

  function betStatus(won: boolean, invalidated: boolean) {
    if (won && !invalidated) {
      return <Checkmark color='status-ok' />;
    } else if (invalidated) {
      return <Clear color='status-warning' />;
    } else {
      return <Close color='status-error' />;
    }
  }

  function getPayOut(won: boolean, invalidated: boolean, payOut: BigNumber) {
    const formattedPayOut = Number(ethers.utils.formatEther(payOut)).toFixed(1);

    if (won && !invalidated) {
      return (
        <Text
          color='status-ok'
          weight='bold'
        >{`+${formattedPayOut} ETH Won`}</Text>
      );
    } else if (invalidated) {
      return (
        <Text color='status-warning' weight='bold'>
          Invalidated
        </Text>
      );
    } else {
      return (
        <Text
          color='status-error'
          weight='bold'
        >{`${formattedPayOut} ETH Lost`}</Text>
      );
    }
  }

  function tableData() {
    const betData = inactiveBets?.map((bet: Bet) => {
      const { betId, team, amount, invalidated, payOut } = bet;

      const won = !invalidated && payOut.gt(0) ? true : false;
      const formattedAmount = ethers.utils.formatEther(amount);

      return (
        <TableRow key={betId.toString()}>
          <TableCell>{team}</TableCell>
          <TableCell style={{ alignItems: "center" }}>
            {betStatus(won, invalidated)}
          </TableCell>
          <TableCell align='center'>{formattedAmount}</TableCell>
          <TableCell align='center'>
            {getPayOut(won, invalidated, payOut)}
          </TableCell>
        </TableRow>
      );
    });

    return <TableBody>{betData}</TableBody>;
  }

  function tableHeader() {
    let columns = ["Team", "Result", "Amount", "Payout"];

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
      {inactiveBets?.length === 0
        ? "You don't have any completed bets"
        : table()}
    </div>
  );
};

export default InactiveBets;

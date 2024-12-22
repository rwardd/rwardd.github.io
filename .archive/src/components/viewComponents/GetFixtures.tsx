import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "grommet";
import React, { FC, useContext, useEffect, useState } from "react";
import { REFRESH_RATE } from "../../constants";
import { GlobalState } from "../../globalState";
import { Fixture } from "../../types";
import AdminFixtureControls from "../AdminFixtureControls";
import FixtureControls from "../FixtureControls";
import { GetOdds } from "./GetBettingTotals";

interface GetFixturesProps {
  admin?: boolean;
  refreshBets?: () => void;
}

const GetFixtures: FC<GetFixturesProps> = (props) => {
  const { admin, refreshBets } = props;
  const { bettingContract } = useContext(GlobalState);
  const [fixtures, setFixtures] = useState<null | any[]>(null);

  async function _getFixtures() {
    if (!bettingContract) {
      throw new Error("Betting Contract not available");
    } else {
      let fixtureList = [];
      const fixtureCount = await bettingContract.getFixtureCount();

      for (let i = 0; i < fixtureCount; i++) {
        fixtureList.push(await bettingContract.getFixture(i));
      }

      setFixtures(fixtureList);
    }
  }

  useEffect(() => {
    // Refresh every second
    const interval = setInterval(() => _getFixtures(), REFRESH_RATE);
    return () => {
      clearInterval(interval);
    };
  });

  function tableData() {
    const fixtureData = fixtures?.map((fixture: Fixture) => {
      const { fixId, home, away, date } = fixture;
      return (
        <TableRow key={fixId.toString()}>
          <TableCell>{home}</TableCell>
          <TableCell align='center'>{away}</TableCell>
          <TableCell align='center'>{date}</TableCell>
          <TableCell align='center'>
            <GetOdds fixtureId={fixId} />
          </TableCell>
          {!admin && refreshBets && (
            <TableCell align='center'>
              <FixtureControls fixture={fixture} refreshBets={refreshBets} />
            </TableCell>
          )}
          {admin && (
            <TableCell align='center'>
              <AdminFixtureControls
                fixture={fixture}
                refreshFixtureData={_getFixtures}
              />
            </TableCell>
          )}
        </TableRow>
      );
    });

    return <TableBody>{fixtureData}</TableBody>;
  }

  function tableHeader() {
    let columns = ["Home", "Away", "Date", "Odds"];
    if (!admin) {
      columns.push("Bet");
    }
    if (admin) {
      columns.push("Controls");
    }

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

  if (fixtures === null) {
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
    <div>
      {fixtures.length === 0 ? "There are currently no fixtures" : table()}
    </div>
  );
};

export default GetFixtures;

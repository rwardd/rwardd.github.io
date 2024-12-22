import { Button } from "grommet";
import { Header as GrommetHeader } from "grommet";
import React, { FC, useContext } from "react";
import { GlobalState } from "../globalState";
import { COLORS, FONT_SIZE } from "../theme";
import { Loading } from "./utils/Loading";
import { FaEthereum } from "react-icons/fa";

const Header: FC = () => {
  const { balance, selectedAddress } = useContext(GlobalState);

  const logo = (
    <h1
      style={{
        fontSize: FONT_SIZE.title,
      }}
    >
      UQBet
    </h1>
  );

  const accountDisplay = () => {
    if (!balance) {
      return <Loading />;
    } else {
      return (
        <div style={accountDisplayStyling}>
          <h5
            style={{ ...textStyling, marginRight: "10px" }}
          >{`${balance} ETH`}</h5>
          <div style={innerDisplay}>
            <h5
              style={{
                ...textStyling,
                marginRight: "10px",
                marginLeft: "8px",
              }}
            >{`${selectedAddress?.slice(0, 5)}...${selectedAddress?.slice(
              -5,
              -1
            )}`}</h5>
            <FaEthereum style={iconStyling} size='35px' />
          </div>
        </div>
      );
    }
  };

  return (
    <div style={headerStyling}>
      <GrommetHeader background='brand'>
        <Button icon={logo} hoverIndicator />
      </GrommetHeader>
      {accountDisplay()}
    </div>
  );
};

const headerStyling: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  color: COLORS.white,
  marginTop: "10px",
  marginBottom: "10px",
  paddingLeft: "12px",
  paddingRight: "45px",
};

const innerDisplay: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  backgroundColor: COLORS.purple,
  color: "white",
  borderRadius: 90,
  padding: "5px 10px",
};

const accountDisplayStyling: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  color: "white",
  backgroundColor: COLORS.lightPurple,
  borderRadius: 90,
  paddingLeft: "12px",
  borderStyle: "solid",
  borderWidth: "2px",
  borderColor: COLORS.lightPurple,
};

const iconStyling: React.CSSProperties = {
  backgroundColor: "#383838",
  borderRadius: 90,
  padding: "5px",
};

const textStyling: React.CSSProperties = { position: "relative", top: 4.5 };

export default Header;

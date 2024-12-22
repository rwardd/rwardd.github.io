import React, { FC } from "react";
import { Button } from "grommet";
import { useNavigate } from "react-router-dom";
import { FormPrevious } from "grommet-icons";

interface BackButtonProps {
  style?: React.CSSProperties;
}

const BackButton: FC<BackButtonProps> = (props) => {
  const { style } = props;
  const navigate = useNavigate();

  return (
    <>
      <Button style={style} onClick={() => navigate(-1)}>
        <FormPrevious color={"brand"} size='35' />
      </Button>
    </>
  );
};

export default BackButton;

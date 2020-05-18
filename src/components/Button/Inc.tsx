import React from "react";
import { Button } from "@material-ui/core";

export const Inc = ({ onClick, ...rest }: { onClick: () => void }) => {
  return (
    <Button onClick={onClick} {...rest}>
      Incrementa
    </Button>
  );
};
